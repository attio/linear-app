import {complete, errored, type Fetchable, isComplete, isErrored} from "@attio/fetchable"
import {beforeEach, describe, expect, it, vi} from "vitest"
import {mockLinearUser} from "../../utils/test/linear-mocks"
import {LinearGqlClientErrorCode} from "../client/linear-gql-client"
import {createUserApi, getUserQuery, listTeamUsersQuery, searchTeamUsersQuery} from "./api"

vi.mock("../client/linear-gql-client")

import {linearGqlClient} from "../client/linear-gql-client"

const mockLinearGqlClient = vi.mocked(linearGqlClient)

const user = mockLinearUser()
const teamMember = {id: user.id, name: user.name, avatarUrl: user.avatarUrl}

function expectComplete<T>(result: Fetchable<T, unknown>, expected: T) {
    expect(isComplete(result)).toBe(true)
    if (isComplete(result)) {
        expect(result.value).toEqual(expected)
    }
}

describe("createUserApi", () => {
    beforeEach(() => {
        mockLinearGqlClient.mockReset()
    })

    describe("get", () => {
        it("requests the user by id", async () => {
            mockLinearGqlClient.mockResolvedValue(
                complete({viewer: {id: "viewer-1"}, user: teamMember})
            )

            const api = createUserApi({requestUsing: "user-connection"})
            await api.get("user-1")

            const [request, options] = mockLinearGqlClient.mock.calls[0]
            expect(request).toMatchObject({
                query: getUserQuery,
                variables: {id: "user-1"},
            })
            expect(options).toMatchObject({requestUsing: "user-connection"})
        })

        it("forwards the workspace connection option", async () => {
            mockLinearGqlClient.mockResolvedValue(
                complete({viewer: {id: "viewer-1"}, user: teamMember})
            )

            const api = createUserApi({requestUsing: "workspace-connection"})
            await api.get("user-1")

            const [, options] = mockLinearGqlClient.mock.calls[0]
            expect(options).toMatchObject({requestUsing: "workspace-connection"})
        })

        it("returns the parsed user", async () => {
            mockLinearGqlClient.mockResolvedValue(
                complete({viewer: {id: "viewer-1"}, user: teamMember})
            )

            const api = createUserApi({requestUsing: "user-connection"})
            const result = await api.get("user-1")

            expectComplete(result, {...user, isMe: false})
        })

        it("returns null when the user does not exist", async () => {
            mockLinearGqlClient.mockResolvedValue(complete({viewer: {id: "viewer-1"}, user: null}))

            const api = createUserApi({requestUsing: "user-connection"})
            const result = await api.get("nonexistent")

            expectComplete(result, null)
        })

        it("marks isMe true when viewer matches", async () => {
            mockLinearGqlClient.mockResolvedValue(
                complete({viewer: {id: user.id}, user: teamMember})
            )

            const api = createUserApi({requestUsing: "user-connection"})
            const result = await api.get(user.id)

            expectComplete(result, {...user, isMe: true})
        })

        it("returns client errors unchanged", async () => {
            const clientError = {
                code: LinearGqlClientErrorCode.HttpError,
                errorMessage: "Unauthorized",
            }
            mockLinearGqlClient.mockResolvedValue(errored(clientError))

            const api = createUserApi({requestUsing: "user-connection"})
            const result = await api.get("user-1")

            expect(isErrored(result)).toBe(true)
            if (isErrored(result)) {
                expect(result.error).toEqual(clientError)
            }
        })
    })

    describe("list", () => {
        it("requests team members", async () => {
            mockLinearGqlClient.mockResolvedValue(
                complete({viewer: {id: "viewer-1"}, team: {members: {nodes: [teamMember]}}})
            )

            const api = createUserApi({requestUsing: "user-connection"})
            await api.list("team-1")

            const [request, options] = mockLinearGqlClient.mock.calls[0]
            expect(request).toMatchObject({
                query: listTeamUsersQuery,
                variables: {teamId: "team-1"},
            })
            expect(options).toMatchObject({requestUsing: "user-connection"})
        })

        it("returns the parsed users", async () => {
            mockLinearGqlClient.mockResolvedValue(
                complete({viewer: {id: "viewer-1"}, team: {members: {nodes: [teamMember]}}})
            )

            const api = createUserApi({requestUsing: "user-connection"})
            const result = await api.list("team-1")

            expectComplete(result, [{...user, isMe: false}])
        })

        it("returns an empty array when the team has no members", async () => {
            mockLinearGqlClient.mockResolvedValue(complete({viewer: {id: "viewer-1"}, team: null}))

            const api = createUserApi({requestUsing: "user-connection"})
            const result = await api.list("team-1")

            expectComplete(result, [])
        })
    })

    describe("search", () => {
        it("searches team members by query", async () => {
            mockLinearGqlClient.mockResolvedValue(
                complete({viewer: {id: "viewer-1"}, team: {members: {nodes: [teamMember]}}})
            )

            const api = createUserApi({requestUsing: "user-connection"})
            await api.search("team-1", "alice")

            const [request, options] = mockLinearGqlClient.mock.calls[0]
            expect(request).toMatchObject({
                query: searchTeamUsersQuery,
                variables: {teamId: "team-1", searchQuery: "alice"},
            })
            expect(options).toMatchObject({requestUsing: "user-connection"})
        })

        it("returns the parsed users", async () => {
            mockLinearGqlClient.mockResolvedValue(
                complete({viewer: {id: "viewer-1"}, team: {members: {nodes: [teamMember]}}})
            )

            const api = createUserApi({requestUsing: "user-connection"})
            const result = await api.search("team-1", "alice")

            expectComplete(result, [{...user, isMe: false}])
        })

        it("returns an empty array when nothing matches", async () => {
            mockLinearGqlClient.mockResolvedValue(complete({viewer: {id: "viewer-1"}, team: null}))

            const api = createUserApi({requestUsing: "user-connection"})
            const result = await api.search("team-1", "nobody")

            expectComplete(result, [])
        })
    })
})
