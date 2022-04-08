import { githubClient } from "./client";
import { 
    GetPRs, GetPRsQuery, GetPRsQueryVariables,
    GetPr, GetPrQuery, GetPrQueryVariables,
    GetPrForImport, GetPrForImportQuery, GetPrForImportQueryVariables,
    AddComment, AddCommentMutation, AddCommentMutationVariables,
    AddPullRequestLabel, AddPullRequestLabelMutation, AddPullRequestLabelMutationVariables
} from "./generated/graphql";

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

export async function getPrInfoForImport(repositoryName: string, prNumber: number): Promise<GetPrForImportQuery> {
    const result = await githubClient().query<GetPrForImportQuery, GetPrForImportQueryVariables>({
        query: GetPrForImport, 
        variables: {
            name: repositoryName, 
            number: prNumber
        }
    })

    return result.data
}

export async function addComment(issueID: string, body: string): Promise<AddCommentMutation> {
    const result = await githubClient().mutate<AddCommentMutation, AddCommentMutationVariables>({
        mutation: AddComment, 
        variables: {
            issueID, 
            body
        }
    })

    return result.data
}


export async function addLabel(issueID: string, labelIds: string): Promise<AddPullRequestLabelMutation> {
    const result = await githubClient().mutate<AddPullRequestLabelMutation, AddPullRequestLabelMutationVariables>({
        mutation: AddPullRequestLabel, 
        variables: {
            issueID,
            labelIds
        }
    })

    return result.data
}
