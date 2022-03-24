import { Axios } from "axios";
import mappings from "./mappings";

export default class JiraAdapter {
    #apiClient = undefined as Axios

    constructor(host, username: string, password: string) {
        this.#apiClient = new Axios({
            baseURL: host,
            auth: {
                username,
                password
            },
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
            
        })
    }

    #getProjectID(projectName: string) {
        return mappings[projectName].jiraIssueKey
    }

    async createTicket(projectName: string, user: {email: string, team: string}, pr: {author: string, description: string, htmlURL: string}) {
        const description = `${pr.description}\n\n---\n\nImported from Github. Please see: ${pr.htmlURL}`

        // todo: maybe set the assignee
        const issueConfig = {
            fields: {
                summary: "Main order flow broken",
                description,
                labels: [
                    "github",
                ],
                issuetype: {
                    name: "Bug"
                },
                project: {
                    id: this.#getProjectID(projectName)
                },
                'customfield_12101': pr.author,
                'customfield_12100': pr.htmlURL,
                'customfield_10202': {
                    id: '10110' // Yes
                },
                'customfield_12000': user.team
            }
        }


        this.#apiClient.post('rest/api/3/issue', {
            issueConfig
        })
    }
}