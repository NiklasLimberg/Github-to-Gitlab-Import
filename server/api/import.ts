import type { IncomingMessage, ServerResponse } from 'http'
import { PassThrough } from 'stream'

import { useQuery, sendStream, sendError, H3Error } from 'h3'

import { getPrInfoForImport } from '../github'
import GitAdapter from '../importer/GitAdapter'
import JiraAdapter from '../importer/jiraAdapter'

import GitlabAdapter from '../importer/GitlabAdapter'

import config from '#config'


export default async (req: IncomingMessage, res: ServerResponse) => {
    const { repositoryName, prNumber } = useQuery(req);

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

    const issueKey = jiraAdapter.createTicket(repositoryName, {email: 'n.limberg@shopware.com', team: '12817'}, {
        author: githubPullRequest.author?.login ?? '',
        description: githubPullRequest.body, 
        htmlURL: githubPullRequest.url
    })



    

    await gitClient.checkout({URL: githubPullRequest.repository.sshUrl, branch})

    outputStream.end('Import Complete!')
}

async function getPRfromGithub(repositoryName: string, pullRequestNumber: number) {
    const githubResponse = await getPrInfoForImport(repositoryName, pullRequestNumber)

    return githubResponse.repository?.pullRequest;
}