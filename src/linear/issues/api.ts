import {type AsyncResult, complete, errored, isComplete, type Result} from "@attio/fetchable"
import {
    createLinearGqlClient,
    type LinearGqlClientError,
    LinearGqlClientErrorCode,
    type PostToLinearOptions,
} from "../client/linear-gql-client"
import {unwrapSuccessMutation} from "../client/mutations"
import {
    type CreateIssueInput,
    createIssueDataSchema,
    deleteIssueDataSchema,
    getIssueDataSchema,
    type LinearIssue,
    type LinearIssueMutationResult,
    listIssuesDataSchema,
    searchIssuesDataSchema,
    type UpdateIssueInput,
    updateIssueDataSchema,
    updateIssueInputSchema,
} from "./schema"

const linearIssueFragment = `
    id
    title
    identifier
    description
    priority
    dueDate
    state {
        id
        name
        color
        type
    }
    assignee {
        id
        name
        email
    }
    labels {
        nodes {
            id
            name
            color
        }
    }
`

function unwrapIssueMutation(
    mutation: LinearIssueMutationResult,
    errorMessage: string
): Result<LinearIssue, LinearGqlClientError> {
    if (!mutation.success || !mutation.issue) {
        return errored({code: LinearGqlClientErrorCode.MutationError, errorMessage})
    }
    return complete(mutation.issue)
}

export const listIssuesQuery = `query Issues {
  issues(first: 50, orderBy: updatedAt) {
    nodes {
      ${linearIssueFragment}
    }
  }
}`

export const getIssueQuery = `query Issue($id: String!) {
  issue(id: $id) {
    ${linearIssueFragment}
  }
}`

export const createIssueQuery = `mutation CreateIssue($input: IssueCreateInput!) {
  issueCreate(input: $input) {
    success
    issue {
      ${linearIssueFragment}
    }
  }
}`

export const deleteIssueQuery = `mutation DeleteIssue($id: String!) {
  issueDelete(id: $id) {
    success
  }
}`

export const searchIssuesQuery = `query SearchIssues($searchQuery: String!) {
  searchIssues(term: $searchQuery, first: 50) {
    nodes {
      ${linearIssueFragment}
    }
  }
}`

export const updateIssueQuery = `mutation UpdateIssue($id: String!, $input: IssueUpdateInput!) {
  issueUpdate(id: $id, input: $input) {
    success
    issue {
      ${linearIssueFragment}
    }
  }
}`

export function createIssueApi(options: PostToLinearOptions) {
    const gql = createLinearGqlClient(options)

    return {
        async get(id: string): AsyncResult<LinearIssue | null, LinearGqlClientError> {
            const result = await gql({query: getIssueQuery, variables: {id}}, getIssueDataSchema)
            if (!isComplete(result)) return result
            return complete(result.value.issue)
        },

        async create(input: CreateIssueInput): AsyncResult<LinearIssue, LinearGqlClientError> {
            const result = await gql(
                {query: createIssueQuery, variables: {input}},
                createIssueDataSchema
            )
            if (!isComplete(result)) return result
            return unwrapIssueMutation(result.value.issueCreate, "Failed to create issue")
        },

        async delete(id: string): AsyncResult<void, LinearGqlClientError> {
            const result = await gql(
                {query: deleteIssueQuery, variables: {id}},
                deleteIssueDataSchema
            )
            if (!isComplete(result)) return result
            return unwrapSuccessMutation(result.value.issueDelete, "Failed to delete issue")
        },

        async search(searchQuery: string): AsyncResult<LinearIssue[], LinearGqlClientError> {
            const result = await gql(
                {query: searchIssuesQuery, variables: {searchQuery}},
                searchIssuesDataSchema
            )
            if (!isComplete(result)) return result
            return complete(result.value.searchIssues.nodes)
        },

        async list(): AsyncResult<LinearIssue[], LinearGqlClientError> {
            const result = await gql({query: listIssuesQuery}, listIssuesDataSchema)
            if (!isComplete(result)) return result
            return complete(result.value.issues.nodes)
        },

        async update(
            id: string,
            input: UpdateIssueInput
        ): AsyncResult<LinearIssue, LinearGqlClientError> {
            const result = await gql(
                {
                    query: updateIssueQuery,
                    variables: {id, input: updateIssueInputSchema.parse(input)},
                },
                updateIssueDataSchema
            )
            if (!isComplete(result)) return result
            return unwrapIssueMutation(result.value.issueUpdate, "Failed to update issue")
        },
    }
}
