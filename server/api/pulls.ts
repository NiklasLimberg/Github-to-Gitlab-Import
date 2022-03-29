import type { IncomingMessage } from 'http'

import { useBody } from 'h3'
import { getPullRequests } from '../github'

import type { PullRequest, User, Label } from '../types/pullRequest'

export default async (req: IncomingMessage) => {
    const body = await useBody(req)
    const pullRequests = await getPullRequests(body.q)

    const refinedPullRequests: PullRequest[] = []

    pullRequests.search.nodes?.forEach(pullRequest => {
        if(pullRequest?.__typename !== 'PullRequest') {
            return
        }

        const assignees: User[] = []
        const labels: Label[] = []

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

        refinedPullRequests.push({
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
            assignees: assignees,
            state: pullRequest.state,
            labels
        })
    })

    return refinedPullRequests as PullRequest[]
}
