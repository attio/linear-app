import {complete, errored, type Fetchable, isComplete, isErrored} from "@attio/fetchable"
import {beforeEach, describe, expect, it, vi} from "vitest"
import {mockLinearProject} from "../../utils/test/linear-mocks"
import {LinearGqlClientErrorCode} from "../client/linear-gql-client"
import {createProjectApi, getProjectQuery, listProjectsQuery, searchProjectsQuery} from "./api"

vi.mock("../client/linear-gql-client")

import {linearGqlClient} from "../client/linear-gql-client"

const mockLinearGqlClient = vi.mocked(linearGqlClient)

const project = mockLinearProject()

function expectComplete<T>(result: Fetchable<T, unknown>, expected: T) {
    expect(isComplete(result)).toBe(true)
    if (isComplete(result)) {
        expect(result.value).toEqual(expected)
    }
}

describe("createProjectApi", () => {
    beforeEach(() => {
        mockLinearGqlClient.mockReset()
    })

    describe("get", () => {
        it("requests the project by id", async () => {
            mockLinearGqlClient.mockResolvedValue(complete({project}))

            const api = createProjectApi({requestUsing: "user-connection"})
            await api.get("project-1")

            const [request, options] = mockLinearGqlClient.mock.calls[0]
            expect(request).toMatchObject({
                query: getProjectQuery,
                variables: {id: "project-1"},
            })
            expect(options).toMatchObject({requestUsing: "user-connection"})
        })

        it("forwards the workspace connection option", async () => {
            mockLinearGqlClient.mockResolvedValue(complete({project}))

            const api = createProjectApi({requestUsing: "workspace-connection"})
            await api.get("project-1")

            const [, options] = mockLinearGqlClient.mock.calls[0]
            expect(options).toMatchObject({requestUsing: "workspace-connection"})
        })

        it("returns the parsed project", async () => {
            mockLinearGqlClient.mockResolvedValue(complete({project}))

            const api = createProjectApi({requestUsing: "user-connection"})
            const result = await api.get("project-1")

            expectComplete(result, project)
        })

        it("returns null when the project does not exist", async () => {
            mockLinearGqlClient.mockResolvedValue(complete({project: null}))

            const api = createProjectApi({requestUsing: "user-connection"})
            const result = await api.get("nonexistent")

            expectComplete(result, null)
        })

        it("returns client errors unchanged", async () => {
            const clientError = {
                code: LinearGqlClientErrorCode.HttpError,
                errorMessage: "Unauthorized",
            }
            mockLinearGqlClient.mockResolvedValue(errored(clientError))

            const api = createProjectApi({requestUsing: "user-connection"})
            const result = await api.get("project-1")

            expect(isErrored(result)).toBe(true)
            if (isErrored(result)) {
                expect(result.error).toEqual(clientError)
            }
        })
    })

    describe("list", () => {
        it("requests only the first 50 projects ordered by updatedAt", async () => {
            mockLinearGqlClient.mockResolvedValue(complete({projects: {nodes: [project]}}))

            const api = createProjectApi({requestUsing: "user-connection"})
            await api.list()

            const [request, options] = mockLinearGqlClient.mock.calls[0]
            expect(request).toMatchObject({query: listProjectsQuery})
            expect(options).toMatchObject({requestUsing: "user-connection"})
        })

        it("returns the parsed projects", async () => {
            mockLinearGqlClient.mockResolvedValue(complete({projects: {nodes: [project]}}))

            const api = createProjectApi({requestUsing: "user-connection"})
            const result = await api.list()

            expectComplete(result, [project])
        })

        it("returns an empty array when there are no projects", async () => {
            mockLinearGqlClient.mockResolvedValue(complete({projects: {nodes: []}}))

            const api = createProjectApi({requestUsing: "user-connection"})
            const result = await api.list()

            expectComplete(result, [])
        })
    })

    describe("search", () => {
        it("limits search results to the first 50 projects", async () => {
            mockLinearGqlClient.mockResolvedValue(complete({searchProjects: {nodes: [project]}}))

            const api = createProjectApi({requestUsing: "user-connection"})
            await api.search("roadmap")

            const [request, options] = mockLinearGqlClient.mock.calls[0]
            expect(request).toMatchObject({
                query: searchProjectsQuery,
                variables: {searchQuery: "roadmap"},
            })
            expect(options).toMatchObject({requestUsing: "user-connection"})
        })

        it("returns the parsed projects", async () => {
            mockLinearGqlClient.mockResolvedValue(complete({searchProjects: {nodes: [project]}}))

            const api = createProjectApi({requestUsing: "user-connection"})
            const result = await api.search("roadmap")

            expectComplete(result, [project])
        })

        it("returns an empty array when nothing matches", async () => {
            mockLinearGqlClient.mockResolvedValue(complete({searchProjects: {nodes: []}}))

            const api = createProjectApi({requestUsing: "user-connection"})
            const result = await api.search("nothing")

            expectComplete(result, [])
        })
    })
})
