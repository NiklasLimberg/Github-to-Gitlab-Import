import type { IncomingMessage } from 'http'

import { useQuery } from 'h3'
import { getPullRequest } from '../github'

import type { ExtendedPullRequest, User, Label, ChangedFile } from '../types/pullRequest'

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
        bodyHTML: pullRequest.bodyHTML,
        labels,
        files
    } as ExtendedPullRequest 
}