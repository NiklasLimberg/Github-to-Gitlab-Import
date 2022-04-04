import type { IncomingMessage } from 'http'

import { useBody } from 'h3'
import { getPullRequests } from '../github'

import { PullRequest, User, Label, PullRequestCollapsedState } from '../types/pullRequest'

export default async (req: IncomingMessage) => {
    let  { q: query } = await useBody(req)

    const regex = /repo:\w*\/\w*/g
    if(!regex.test(query)) {
        query += ' org:shopware'
    }

    console.log(query)

    const pullRequests = await getPullRequests(query)

    const refinedPullRequests: PullRequest[] = []

    pullRequests.search.nodes?.forEach(pullRequest => {
        if(pullRequest?.__typename !== 'PullRequest') {
            return
        }

        const assignees: User[] = []
        const labels: Label[] = []
        let collapsedState: PullRequestCollapsedState = PullRequestCollapsedState.Ready


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

        if(pullRequest.reviewDecision === 'CHANGES_REQUESTED') {
            collapsedState = PullRequestCollapsedState.ReviewFailed
        }
    
        if(!pullRequest.mergeable) {
            collapsedState = PullRequestCollapsedState.MergeConflicts
        }
    
        if(labels.some(label => label.name === 'scheduled')) {
            collapsedState = PullRequestCollapsedState.Imported
        }

        refinedPullRequests.push({
            id: pullRequest.id,
            url: pullRequest.url,
            number: pullRequest.number,
            collapsedState,
            reviewDecision: pullRequest.reviewDecision ?? "REVIEW_REQUIRED",
            title: pullRequest.title,
            createdAt: pullRequest.createdAt,
            lastEditedAt: pullRequest.lastEditedAt,
            mergeable: pullRequest.mergeable === 'MERGEABLE',
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
