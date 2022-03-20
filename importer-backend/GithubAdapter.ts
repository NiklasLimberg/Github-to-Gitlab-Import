import { Octokit } from "@octokit/core";

export default class GithubAdapter {
    #octokit

    constructor(authToken) {
        this.#octokit = new Octokit({auth: authToken})
    }

    setLabels(owner: string, repository: string, issueNumber: number, labels: string[]) {
        return this.#octokit.request('PUT /repos/{owner}/{repo}/issues/{issue_number}/labels', {
            owner,
            repo: repository,
            issue_number: issueNumber,
            labels
        })
    }

    createComment(owner: string, repository: string, prNumber: number, commentBody: string) {
        return this.#octokit.request('POST /repos/{owner}/{repo}/pulls/{pull_number}/comments', {
            owner,
            repo: repository,
            pull_number: prNumber,
            body: commentBody
        })
    }

    getPullRequestCommits(owner: string, repository: string, prNumber: number) {
        return this.#octokit.request('GET /repos/{owner}/{repo}/pulls/{pull_number}/commits', {
            owner,
            repo: repository,
            pull_number: prNumber,
        })
    }
}