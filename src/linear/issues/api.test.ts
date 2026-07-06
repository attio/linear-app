import {complete, errored, type Fetchable, isComplete, isErrored} from "@attio/fetchable"
import {beforeEach, describe, expect, it, vi} from "vitest"
import {mockLinearIssue} from "../../utils/test/linear-mocks"
import {LinearGqlClientErrorCode} from "../client/linear-gql-client"
import {
    createIssueApi,
    createIssueQuery,
    deleteIssueQuery,
    getIssueQuery,
    listIssuesQuery,
    searchIssuesQuery,
    updateIssueQuery,
} from "./api"

vi.mock("../client/linear-gql-client")

import {linearGqlClient} from "../client/linear-gql-client"

const mockLinearGqlClient = vi.mocked(linearGqlClient)

const issue = mockLinearIssue()

function expectComplete<T>(result: Fetchable<T, unknown>, expected: T) {
    expect(isComplete(result)).toBe(true)
    if (isComplete(result)) {
        expect(result.value).toEqual(expected)
    }
}

describe("createIssueApi", () => {
    beforeEach(() => {
        mockLinearGqlClient.mockReset()
    })

    describe("get", () => {
        it("requests the issue by id", async () => {
            mockLinearGqlClient.mockResolvedValue(complete({issue}))

            const api = createIssueApi({requestUsing: "user-connection"})
            await api.get("issue-1")

            const [request, options] = mockLinearGqlClient.mock.calls[0]
            expect(request).toMatchObject({
                query: getIssueQuery,
                variables: {id: "issue-1"},
            })
            expect(options).toMatchObject({requestUsing: "user-connection"})
        })

        it("forwards the workspace connection option", async () => {
            mockLinearGqlClient.mockResolvedValue(complete({issue}))

            const api = createIssueApi({requestUsing: "workspace-connection"})
            await api.get("issue-1")

            const [, options] = mockLinearGqlClient.mock.calls[0]
            expect(options).toMatchObject({requestUsing: "workspace-connection"})
        })

        it("returns the parsed issue", async () => {
            mockLinearGqlClient.mockResolvedValue(complete({issue}))

            const api = createIssueApi({requestUsing: "user-connection"})
            const result = await api.get("issue-1")

            expectComplete(result, issue)
        })

        it("returns null when the issue does not exist", async () => {
            mockLinearGqlClient.mockResolvedValue(complete({issue: null}))

            const api = createIssueApi({requestUsing: "user-connection"})
            const result = await api.get("nonexistent")

            expectComplete(result, null)
        })

        it("returns client errors unchanged", async () => {
            const clientError = {
                code: LinearGqlClientErrorCode.HttpError,
                errorMessage: "Unauthorized",
            }
            mockLinearGqlClient.mockResolvedValue(errored(clientError))

            const api = createIssueApi({requestUsing: "user-connection"})
            const result = await api.get("issue-1")

            expect(isErrored(result)).toBe(true)
            if (isErrored(result)) {
                expect(result.error).toEqual(clientError)
            }
        })
    })

    describe("create", () => {
        const input = {
            teamId: "team-1",
            title: "New issue",
        }

        it("sends the create issue mutation", async () => {
            mockLinearGqlClient.mockResolvedValue(complete({issueCreate: {success: true, issue}}))

            const api = createIssueApi({requestUsing: "user-connection"})
            await api.create(input)

            const [request, options] = mockLinearGqlClient.mock.calls[0]
            expect(request).toMatchObject({
                query: createIssueQuery,
                variables: {input},
            })
            expect(options).toMatchObject({requestUsing: "user-connection"})
        })

        it("returns the created issue", async () => {
            mockLinearGqlClient.mockResolvedValue(complete({issueCreate: {success: true, issue}}))

            const api = createIssueApi({requestUsing: "user-connection"})
            const result = await api.create(input)

            expectComplete(result, issue)
        })

        it("returns a mutation error when creation fails", async () => {
            mockLinearGqlClient.mockResolvedValue(
                complete({issueCreate: {success: false, issue: null}})
            )

            const api = createIssueApi({requestUsing: "user-connection"})
            const result = await api.create(input)

            expect(isErrored(result)).toBe(true)
            if (isErrored(result)) {
                expect(result.error).toEqual({
                    code: LinearGqlClientErrorCode.MutationError,
                    errorMessage: "Failed to create issue",
                })
            }
        })
    })

    describe("delete", () => {
        it("sends the delete issue mutation", async () => {
            mockLinearGqlClient.mockResolvedValue(complete({issueDelete: {success: true}}))

            const api = createIssueApi({requestUsing: "user-connection"})
            await api.delete("issue-1")

            const [request, options] = mockLinearGqlClient.mock.calls[0]
            expect(request).toMatchObject({
                query: deleteIssueQuery,
                variables: {id: "issue-1"},
            })
            expect(options).toMatchObject({requestUsing: "user-connection"})
        })

        it("returns undefined on success", async () => {
            mockLinearGqlClient.mockResolvedValue(complete({issueDelete: {success: true}}))

            const api = createIssueApi({requestUsing: "user-connection"})
            const result = await api.delete("issue-1")

            expectComplete(result, undefined)
        })

        it("returns a mutation error when deletion fails", async () => {
            mockLinearGqlClient.mockResolvedValue(complete({issueDelete: {success: false}}))

            const api = createIssueApi({requestUsing: "user-connection"})
            const result = await api.delete("issue-1")

            expect(isErrored(result)).toBe(true)
            if (isErrored(result)) {
                expect(result.error).toEqual({
                    code: LinearGqlClientErrorCode.MutationError,
                    errorMessage: "Failed to delete issue",
                })
            }
        })
    })

    describe("search", () => {
        it("limits search results to the first 50 issues", async () => {
            mockLinearGqlClient.mockResolvedValue(complete({searchIssues: {nodes: [issue]}}))

            const api = createIssueApi({requestUsing: "user-connection"})
            await api.search("dropdown")

            const [request, options] = mockLinearGqlClient.mock.calls[0]
            expect(request).toMatchObject({
                query: searchIssuesQuery,
                variables: {searchQuery: "dropdown"},
            })
            expect(options).toMatchObject({requestUsing: "user-connection"})
        })

        it("returns the parsed issues", async () => {
            mockLinearGqlClient.mockResolvedValue(complete({searchIssues: {nodes: [issue]}}))

            const api = createIssueApi({requestUsing: "user-connection"})
            const result = await api.search("dropdown")

            expectComplete(result, [issue])
        })

        it("returns an empty array when nothing matches", async () => {
            mockLinearGqlClient.mockResolvedValue(complete({searchIssues: {nodes: []}}))

            const api = createIssueApi({requestUsing: "user-connection"})
            const result = await api.search("nothing")

            expectComplete(result, [])
        })
    })

    describe("list", () => {
        it("requests the latest issues", async () => {
            mockLinearGqlClient.mockResolvedValue(complete({issues: {nodes: [issue]}}))

            const api = createIssueApi({requestUsing: "user-connection"})
            await api.list()

            const [request, options] = mockLinearGqlClient.mock.calls[0]
            expect(request).toMatchObject({query: listIssuesQuery})
            expect(options).toMatchObject({requestUsing: "user-connection"})
        })

        it("returns the parsed issues", async () => {
            mockLinearGqlClient.mockResolvedValue(complete({issues: {nodes: [issue]}}))

            const api = createIssueApi({requestUsing: "user-connection"})
            const result = await api.list()

            expectComplete(result, [issue])
        })

        it("returns an empty array when there are no issues", async () => {
            mockLinearGqlClient.mockResolvedValue(complete({issues: {nodes: []}}))

            const api = createIssueApi({requestUsing: "user-connection"})
            const result = await api.list()

            expectComplete(result, [])
        })
    })

    describe("update", () => {
        const input = {title: "Updated title"}

        it("sends the update issue mutation", async () => {
            mockLinearGqlClient.mockResolvedValue(complete({issueUpdate: {success: true, issue}}))

            const api = createIssueApi({requestUsing: "user-connection"})
            await api.update("issue-1", input)

            const [request, options] = mockLinearGqlClient.mock.calls[0]
            expect(request).toMatchObject({
                query: updateIssueQuery,
                variables: {id: "issue-1", input},
            })
            expect(options).toMatchObject({requestUsing: "user-connection"})
        })

        it("returns the updated issue", async () => {
            mockLinearGqlClient.mockResolvedValue(complete({issueUpdate: {success: true, issue}}))

            const api = createIssueApi({requestUsing: "user-connection"})
            const result = await api.update("issue-1", input)

            expectComplete(result, issue)
        })

        it("returns a mutation error when the update fails", async () => {
            mockLinearGqlClient.mockResolvedValue(
                complete({issueUpdate: {success: false, issue: null}})
            )

            const api = createIssueApi({requestUsing: "user-connection"})
            const result = await api.update("issue-1", input)

            expect(isErrored(result)).toBe(true)
            if (isErrored(result)) {
                expect(result.error).toEqual({
                    code: LinearGqlClientErrorCode.MutationError,
                    errorMessage: "Failed to update issue",
                })
            }
        })
    })
})
