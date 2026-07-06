import {complete, errored, type Fetchable, isComplete, isErrored} from "@attio/fetchable"
import {beforeEach, describe, expect, it, vi} from "vitest"
import {LinearGqlClientErrorCode} from "../client/linear-gql-client"
import {createPriorityApi, listPrioritiesQuery} from "./api"

vi.mock("../client/linear-gql-client")

import {linearGqlClient} from "../client/linear-gql-client"

const mockLinearGqlClient = vi.mocked(linearGqlClient)

const priorities = [
    {priority: 2, label: "High"},
    {priority: 0, label: "No priority"},
]

function expectComplete<T>(result: Fetchable<T, unknown>, expected: T) {
    expect(isComplete(result)).toBe(true)
    if (isComplete(result)) {
        expect(result.value).toEqual(expected)
    }
}

describe("createPriorityApi", () => {
    beforeEach(() => {
        mockLinearGqlClient.mockReset()
    })

    describe("list", () => {
        it("requests priority values from Linear", async () => {
            mockLinearGqlClient.mockResolvedValue(complete({issuePriorityValues: priorities}))

            const api = createPriorityApi({requestUsing: "user-connection"})
            await api.list()

            const [request, options] = mockLinearGqlClient.mock.calls[0]
            expect(request).toMatchObject({query: listPrioritiesQuery})
            expect(options).toMatchObject({requestUsing: "user-connection"})
        })

        it("forwards the workspace connection option", async () => {
            mockLinearGqlClient.mockResolvedValue(complete({issuePriorityValues: priorities}))

            const api = createPriorityApi({requestUsing: "workspace-connection"})
            await api.list()

            const [, options] = mockLinearGqlClient.mock.calls[0]
            expect(options).toMatchObject({requestUsing: "workspace-connection"})
        })

        it("sorts priorities by numeric value", async () => {
            mockLinearGqlClient.mockResolvedValue(complete({issuePriorityValues: priorities}))

            const api = createPriorityApi({requestUsing: "user-connection"})
            const result = await api.list()

            expectComplete(result, [
                {priority: 0, label: "No priority"},
                {priority: 2, label: "High"},
            ])
        })

        it("returns an empty array when no priorities exist", async () => {
            mockLinearGqlClient.mockResolvedValue(complete({issuePriorityValues: []}))

            const api = createPriorityApi({requestUsing: "user-connection"})
            const result = await api.list()

            expectComplete(result, [])
        })

        it("returns client errors unchanged", async () => {
            const clientError = {
                code: LinearGqlClientErrorCode.HttpError,
                errorMessage: "Unauthorized",
            }
            mockLinearGqlClient.mockResolvedValue(errored(clientError))

            const api = createPriorityApi({requestUsing: "user-connection"})
            const result = await api.list()

            expect(isErrored(result)).toBe(true)
            if (isErrored(result)) {
                expect(result.error).toEqual(clientError)
            }
        })
    })
})
