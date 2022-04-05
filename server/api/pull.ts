import type { IncomingMessage } from 'http'

import { useQuery } from 'h3'
import { getPullRequest } from '../github'

import { ExtendedPullRequest, User, Label, ChangedFile, PullRequestCollapsedState } from '../types/pullRequest'

export default async (req: IncomingMessage) => {
    const query = useQuery(req) as { repositoryName: string, prNumber: string }

    const response = await getPullRequest(query.repositoryName, parseInt(query.prNumber))

    const pullRequest = response.repository?.pullRequest
    
    if(pullRequest?.__typename !== 'PullRequest') {
        throw new Error("the github api didn't return a pullRequest")
    }

    const assignees: User[] = []
    const labels: Label[] = []
    const files: ChangedFile[] = []
    let collapsedState: PullRequestCollapsedState = PullRequestCollapsedState.Ready
    let originalCommitMessage = ''

    pullRequest.assignees?.nodes?.map(assignee => {

        if(assignee?.__typename !== 'User') {
            return
        }
            
        assignees.push({
            login: assignee.login,
            avatarURL: assignee.avatarUrl
        })
    })
        
    pullRequest.labels?.nodes?.map(label => {
        if(label?.__typename !== 'Label') {
            return
        }
            
        labels.push({
            id: label?.id,
            color: label?.color,
            name: label.name
        })
    })

    pullRequest.files?.nodes?.map(file => {
        if(file?.__typename !== 'PullRequestChangedFile') {
            return
        }
            
        files.push({
            path: file.path, 
            additions: file.additions,
            deletions: file.deletions
        })
    })


    if(pullRequest.reviewDecision === 'CHANGES_REQUESTED') {
        collapsedState = PullRequestCollapsedState.ReviewFailed
    }

    if(!pullRequest.mergeable) {
        collapsedState = PullRequestCollapsedState.MergeConflicts
    }

    if(labels.some(label => label.name === 'scheduled')) {
        collapsedState = PullRequestCollapsedState.Imported
    }

    const commits = pullRequest.commits; 
    if(commits.__typename === 'PullRequestCommitConnection') {
        originalCommitMessage = commits.nodes?.at(0)?.commit?.message ?? ''
    }

    return {
        id: pullRequest.id,
        url: pullRequest.url,
        number: pullRequest.number,
        reviewDecision: pullRequest.reviewDecision ?? "REVIEW_REQUIRED",
        title: pullRequest.title,
        createdAt: pullRequest.createdAt,
        lastEditedAt: pullRequest.lastEditedAt,
        author: {
            login: pullRequest.author?.login || '',
            avatarURL: pullRequest.author?.avatarUrl
        },
        repository: {
            id: pullRequest.repository.id,
            name: pullRequest.repository.name
        },
        baseRefOid: pullRequest.baseRefOid,
        headRefOid: pullRequest.headRefOid,
        additions: pullRequest.additions,
        deletions: pullRequest.deletions,
        assignees: assignees,
        state: pullRequest.state,
        originalCommitMessage,
        mergeable: pullRequest.mergeable === 'MERGEABLE',
        collapsedState,
        bodyHTML: pullRequest.bodyHTML,
        labels,
        files
    } as ExtendedPullRequest 
}
