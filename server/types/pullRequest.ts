export interface Label {
    id: string
    name: string
    color: string
}

export interface User {
    login: string
    avatarURL?: string
}

export interface ChangedFile {
    path: string,
    additions: number
    deletions: number
}

export interface PullRequest {
    id: string
    url: string
    number: number
    title: string
    createdAt: string
    lastEditedAt: string
    author: User
    repository: {
      id: string
      name: string
    }
    assignees?: User[]
    state: 'CLOSED' | 'MERGED' | 'OPEN'
    reviewDecision: 'APPROVED' | 'CHANGES_REQUESTED' | 'REVIEW_REQUIRED'
    labels?: Label[]
}

export interface ExtendedPullRequest extends PullRequest {
    files: ChangedFile[]
    baseRefOid: string
    headRefOid: string
    bodyHTML: string
    additions: number
    deletions: number
}