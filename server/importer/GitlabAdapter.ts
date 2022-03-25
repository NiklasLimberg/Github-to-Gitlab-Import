import { Axios } from 'axios';
import {mappings, mappingKeys} from  './mappings';

// Schema translated from https://docs.gitlab.com/ee/api/merge_requests.html#create-mr
interface MergeRequestSchema {
    title: string,
    source_branch: string,
    target_branch: string,
    description: string,
    target_project_id: number,
    labels: string,
    remove_source_branch: boolean,
    squash: boolean
}

export default class GitlabAdapter {
    #axios: Axios

    constructor(baseURL: string, authToken: string) {
        this.#axios = new Axios({
            baseURL: baseURL,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'PRIVATE-TOKEN': authToken
            }
        });
    }

    #getGitlabProjectID(projectName: string) {
        if(!Object.keys(mappings).includes(projectName)) {
            throw new Error(`[Gitlab] can't find mapping for ${projectName}`)
        }
        
        return mappings[projectName as mappingKeys].gitlabProjectID
    }

    async createGitlabMergeRequest(pullRequest: {
            jiraIssue: string 
            title: string,
            description: string,  
            targetBranch: string,
            githubURL: string,
            localeBranchName: string
            projectName: string
        }, labels: string[]) {
        // todo strip tags
        const description = `${pullRequest.description}\n\n> Jira: https://shopware.atlassian.net/browse/${pullRequest.jiraIssue}\n> Github-PR: ${pullRequest.githubURL}`

        const gitlabResponse = await this.#axios.post(`/projects/${this.#getGitlabProjectID(pullRequest.projectName)}/merge_requests`, {
            title: `${pullRequest.jiraIssue} - ${pullRequest.title}`,
            description,
            source_branch: pullRequest.localeBranchName,
            target_branch: pullRequest.targetBranch,
            target_project_id: this.#getGitlabProjectID(pullRequest.projectName),
            labels: labels?.join(',') ?? 'github',
            remove_source_branch: false,
            squash: false
        } as MergeRequestSchema);

        return gitlabResponse.data.web_url;
    }
}