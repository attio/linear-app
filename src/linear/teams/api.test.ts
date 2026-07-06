import {complete, errored, type Fetchable, isComplete, isErrored} from "@attio/fetchable"
import {beforeEach, describe, expect, it, vi} from "vitest"
import {mockLinearTeam} from "../../utils/test/linear-mocks"
import {LinearGqlClientErrorCode} from "../client/linear-gql-client"
import {createTeamApi, getTeamQuery, listTeamsQuery, searchTeamsQuery} from "./api"

vi.mock("../client/linear-gql-client")

import {linearGqlClient} from "../client/linear-gql-client"

const mockLinearGqlClient = vi.mocked(linearGqlClient)

const team = mockLinearTeam()

function expectComplete<T>(result: Fetchable<T, unknown>, expected: T) {
    expect(isComplete(result)).toBe(true)
    if (isComplete(result)) {
        expect(result.value).toEqual(expected)
    }
}

describe("createTeamApi", () => {
    beforeEach(() => {
        mockLinearGqlClient.mockReset()
    })

    describe("get", () => {
        it("requests the team by id", async () => {
            mockLinearGqlClient.mockResolvedValue(complete({team}))

            const api = createTeamApi({requestUsing: "user-connection"})
            await api.get("team-1")

            const [request, options] = mockLinearGqlClient.mock.calls[0]
            expect(request).toMatchObject({
                query: getTeamQuery,
                variables: {id: "team-1"},
            })
            expect(options).toMatchObject({requestUsing: "user-connection"})
        })

        it("forwards the workspace connection option", async () => {
            mockLinearGqlClient.mockResolvedValue(complete({team}))

            const api = createTeamApi({requestUsing: "workspace-connection"})
            await api.get("team-1")

            const [, options] = mockLinearGqlClient.mock.calls[0]
            expect(options).toMatchObject({requestUsing: "workspace-connection"})
        })

        it("returns the parsed team", async () => {
            mockLinearGqlClient.mockResolvedValue(complete({team}))

            const api = createTeamApi({requestUsing: "user-connection"})
            const result = await api.get("team-1")

            expectComplete(result, team)
        })

        it("returns null when the team does not exist", async () => {
            mockLinearGqlClient.mockResolvedValue(complete({team: null}))

            const api = createTeamApi({requestUsing: "user-connection"})
            const result = await api.get("nonexistent")

            expectComplete(result, null)
        })

        it("returns client errors unchanged", async () => {
            const clientError = {
                code: LinearGqlClientErrorCode.HttpError,
                errorMessage: "Unauthorized",
            }
            mockLinearGqlClient.mockResolvedValue(errored(clientError))

            const api = createTeamApi({requestUsing: "user-connection"})
            const result = await api.get("team-1")

            expect(isErrored(result)).toBe(true)
            if (isErrored(result)) {
                expect(result.error).toEqual(clientError)
            }
        })
    })

    describe("list", () => {
        it("requests teams", async () => {
            mockLinearGqlClient.mockResolvedValue(complete({teams: {nodes: [team]}}))

            const api = createTeamApi({requestUsing: "user-connection"})
            await api.list()

            const [request, options] = mockLinearGqlClient.mock.calls[0]
            expect(request).toMatchObject({query: listTeamsQuery})
            expect(options).toMatchObject({requestUsing: "user-connection"})
        })

        it("returns the parsed teams", async () => {
            mockLinearGqlClient.mockResolvedValue(complete({teams: {nodes: [team]}}))

            const api = createTeamApi({requestUsing: "user-connection"})
            const result = await api.list()

            expectComplete(result, [team])
        })

        it("returns an empty array when there are no teams", async () => {
            mockLinearGqlClient.mockResolvedValue(complete({teams: {nodes: []}}))

            const api = createTeamApi({requestUsing: "user-connection"})
            const result = await api.list()

            expectComplete(result, [])
        })
    })

    describe("search", () => {
        it("searches teams by query", async () => {
            mockLinearGqlClient.mockResolvedValue(complete({teams: {nodes: [team]}}))

            const api = createTeamApi({requestUsing: "user-connection"})
            await api.search("eng")

            const [request, options] = mockLinearGqlClient.mock.calls[0]
            expect(request).toMatchObject({
                query: searchTeamsQuery,
                variables: {searchQuery: "eng"},
            })
            expect(options).toMatchObject({requestUsing: "user-connection"})
        })

        it("returns the parsed teams", async () => {
            mockLinearGqlClient.mockResolvedValue(complete({teams: {nodes: [team]}}))

            const api = createTeamApi({requestUsing: "user-connection"})
            const result = await api.search("eng")

            expectComplete(result, [team])
        })

        it("returns an empty array when nothing matches", async () => {
            mockLinearGqlClient.mockResolvedValue(complete({teams: {nodes: []}}))

            const api = createTeamApi({requestUsing: "user-connection"})
            const result = await api.search("nothing")

            expectComplete(result, [])
        })
    })
})
