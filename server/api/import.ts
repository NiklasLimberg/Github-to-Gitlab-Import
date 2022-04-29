import type { IncomingMessage, ServerResponse } from 'http'
import { PassThrough } from 'stream'

import { useBody, sendStream, sendError, H3Error } from 'h3'

import { getPrInfoForImport, addComment, addLabel } from '../github'
import GitAdapter from '../importer/GitAdapter'
import JiraAdapter from '../importer/JiraAdapter'

import GitlabAdapter from '../importer/GitlabAdapter'

import config from '#config'

export default async (req: IncomingMessage, res: ServerResponse) => {
    const { repositoryName, prNumber, userOverwrites, overwritesMessage } = await useBody(req);

    // user information for testing
    const userEmail = 'n.limberg@shopware.com'
    const userTeam = '12817'

    if(typeof repositoryName !== 'string' ||  repositoryName.length === 0) {
        return sendError(res, new H3Error('Option repositoryName need to be supplied'))
    }

    let pullRequestNumber = 0;
    try {
        pullRequestNumber = parseInt(prNumber as string, 2)
    } catch (e) {
        return sendError(res, new H3Error('Could not parse pullRequestNumber from query'))
    }

    if(pullRequestNumber <= 0) {
        return sendError(res, new H3Error('pullRequestNumber has to be positive'))
    }

    const outputStream = new PassThrough()
    sendStream(res, outputStream)
    
    const githubPullRequest = await getPRfromGithub(repositoryName, pullRequestNumber);

    if(!githubPullRequest) {
        return sendError(res, new H3Error('Could not fetch PR'))
    }

    const gitClient = new GitAdapter(outputStream);
    const jiraAdapter = new JiraAdapter('shopware.atlassian.net', config.JIRA_USER_NAME, config.JIRA_USER_PASSWORD) 
    const gitlabClient = new GitlabAdapter('shopware.atlassian.net/', config.GITLAB_AUTH_TOKEN)


    outputStream.write(`Creating Ticket for ${githubPullRequest.title}`)

    const issueKey = await jiraAdapter.createTicket(repositoryName, {email: userEmail, team: userTeam}, {
        title: githubPullRequest.title,
        author: githubPullRequest.author?.login ?? '',
        description: githubPullRequest.body, 
        htmlURL: githubPullRequest.url
    })

    outputStream.write('Checking out Github brach\n')

    const localBranch = `${issueKey}/auto-imported-from-github`
    await gitClient.checkout(
        {
            URL: githubPullRequest.repository.sshUrl,
            branch: localBranch,
            name: repositoryName
        }, 
        githubPullRequest.headRef?.id ?? ''
    )

    outputStream.write('Squashing and renaming commits\n')
    await gitClient.squashAndRenameCommits(issueKey, pullRequestNumber, 
        githubPullRequest.commits?.nodes?.at(0)?.commit.oid, 
        githubPullRequest.commits.totalCount > 1
    )

    if(Array.isArray(userOverwrites)) {
        const overwrites = userOverwrites.join('\n\n').replaceAll('${issueKey}', issueKey)
        console.log(overwrites)

        gitClient.applyPatch(overwrites, overwritesMessage, userEmail)
    }

    outputStream.write('Pushing branch to gitlab\n')
    await gitClient.pushBranch(repositoryName, localBranch)

    outputStream.write('Creating Gitlab Merge Request\n')
    await gitlabClient.createMergeRequest({
        jiraIssue: issueKey,
        title: githubPullRequest.title,
        description: githubPullRequest.body,
        githubURL: githubPullRequest.url,
        localeBranchName: localBranch,
        projectName: repositoryName,
        targetBranch: localBranch
    })

    outputStream.write('Adding Comment to github pull request\n')
    await addComment(githubPullRequest.id, getCommentMessage(issueKey))

    outputStream.write('Adding Label to github pull request\n')
    await addLabel(githubPullRequest.id, 'Scheduled')

    outputStream.end('Import Complete!')
}

function getCommentMessage(issueKey: string) {
    return `Hello,\nthank you for creating this pull request.\nI have opened an issue on our Issue Tracker for you. See the issue link: ${issueKey}\nPlease use this issue to track the state of your pull request.`
}

async function getPRfromGithub(repositoryName: string, pullRequestNumber: number) {
    const githubResponse = await getPrInfoForImport(repositoryName, pullRequestNumber)

    return githubResponse.repository?.pullRequest;
}