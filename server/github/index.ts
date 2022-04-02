import { githubClient } from "./client";
import { GetPRs, GetPRsQuery, GetPRsQueryVariables, GetPr, GetPrQuery, GetPrQueryVariables  } from "./generated/graphql";

export async function getPullRequests(query: string): Promise<GetPRsQuery> {
    const result = await githubClient().query<GetPRsQuery, GetPRsQueryVariables>({
        query: GetPRs, 
        variables: { query }
    })

    return result.data
}

export async function getPullRequest(repositoryName: string, prNumber: number): Promise<GetPrQuery> {
    const result = await githubClient().query<GetPrQuery, GetPrQueryVariables>({
        query: GetPr, 
        variables: {
            name: repositoryName, 
            number: prNumber
        }
    })

    return result.data
}

