import {complete, errored, type Fetchable, isComplete, isErrored} from "@attio/fetchable"
import {beforeEach, describe, expect, it, vi} from "vitest"
import {mockLinearWorkflowState} from "../../utils/test/linear-mocks"
import {LinearGqlClientErrorCode} from "../client/linear-gql-client"
import {createWorkflowStateApi, listWorkflowStatesQuery} from "./api"

vi.mock("../client/linear-gql-client")

import {linearGqlClient} from "../client/linear-gql-client"

const mockLinearGqlClient = vi.mocked(linearGqlClient)

const stateA = mockLinearWorkflowState({id: "a", position: 2})
const stateB = mockLinearWorkflowState({id: "b", position: 1})

function expectComplete<T>(result: Fetchable<T, unknown>, expected: T) {
    expect(isComplete(result)).toBe(true)
    if (isComplete(result)) {
        expect(result.value).toEqual(expected)
    }
}

describe("createWorkflowStateApi", () => {
    beforeEach(() => {
        mockLinearGqlClient.mockReset()
    })

    describe("list", () => {
        it("requests workflow states from Linear", async () => {
            mockLinearGqlClient.mockResolvedValue(
                complete({workflowStates: {nodes: [stateA, stateB]}})
            )

            const api = createWorkflowStateApi({requestUsing: "user-connection"})
            await api.list()

            const [request, options] = mockLinearGqlClient.mock.calls[0]
            expect(request).toMatchObject({query: listWorkflowStatesQuery})
            expect(options).toMatchObject({requestUsing: "user-connection"})
        })

        it("forwards the workspace connection option", async () => {
            mockLinearGqlClient.mockResolvedValue(
                complete({workflowStates: {nodes: [stateA, stateB]}})
            )

            const api = createWorkflowStateApi({requestUsing: "workspace-connection"})
            await api.list()

            const [, options] = mockLinearGqlClient.mock.calls[0]
            expect(options).toMatchObject({requestUsing: "workspace-connection"})
        })

        it("returns parsed states sorted by position", async () => {
            mockLinearGqlClient.mockResolvedValue(
                complete({workflowStates: {nodes: [stateA, stateB]}})
            )

            const api = createWorkflowStateApi({requestUsing: "workspace-connection"})
            const result = await api.list()

            expectComplete(result, [stateB, stateA])
        })

        it("returns empty array when no states", async () => {
            mockLinearGqlClient.mockResolvedValue(complete({workflowStates: {nodes: []}}))

            const api = createWorkflowStateApi({requestUsing: "workspace-connection"})
            const result = await api.list()

            expectComplete(result, [])
        })

        it("returns client errors unchanged", async () => {
            const clientError = {
                code: LinearGqlClientErrorCode.HttpError,
                errorMessage: "Unauthorized",
            }
            mockLinearGqlClient.mockResolvedValue(errored(clientError))

            const api = createWorkflowStateApi({requestUsing: "user-connection"})
            const result = await api.list()

            expect(isErrored(result)).toBe(true)
            if (isErrored(result)) {
                expect(result.error).toEqual(clientError)
            }
        })
    })
})
