import {complete, errored, type Fetchable, isComplete, isErrored} from "@attio/fetchable"
import {beforeEach, describe, expect, it, vi} from "vitest"
import {mockLinearIssueLabel} from "../../utils/test/linear-mocks"
import {LinearGqlClientErrorCode} from "../client/linear-gql-client"
import {createLabelApi, getIssueLabelsQuery} from "./api"

vi.mock("../client/linear-gql-client")

import {linearGqlClient} from "../client/linear-gql-client"

const mockLinearGqlClient = vi.mocked(linearGqlClient)

const label = mockLinearIssueLabel()

function expectComplete<T>(result: Fetchable<T, unknown>, expected: T) {
    expect(isComplete(result)).toBe(true)
    if (isComplete(result)) {
        expect(result.value).toEqual(expected)
    }
}

describe("createLabelApi", () => {
    beforeEach(() => {
        mockLinearGqlClient.mockReset()
    })

    describe("list", () => {
        it("requests all issue labels", async () => {
            mockLinearGqlClient.mockResolvedValue(complete({issueLabels: {nodes: [label]}}))

            const api = createLabelApi({requestUsing: "user-connection"})
            await api.list()

            const [request, options] = mockLinearGqlClient.mock.calls[0]
            expect(request).toMatchObject({query: getIssueLabelsQuery})
            expect(options).toMatchObject({requestUsing: "user-connection"})
        })

        it("forwards workspace-connection", async () => {
            mockLinearGqlClient.mockResolvedValue(complete({issueLabels: {nodes: []}}))

            const api = createLabelApi({requestUsing: "workspace-connection"})
            await api.list()

            const [, options] = mockLinearGqlClient.mock.calls[0]
            expect(options).toMatchObject({requestUsing: "workspace-connection"})
        })

        it("returns parsed labels", async () => {
            mockLinearGqlClient.mockResolvedValue(complete({issueLabels: {nodes: [label]}}))

            const api = createLabelApi({requestUsing: "user-connection"})
            const result = await api.list()

            expectComplete(result, [label])
        })

        it("returns empty array when no labels", async () => {
            mockLinearGqlClient.mockResolvedValue(complete({issueLabels: {nodes: []}}))

            const api = createLabelApi({requestUsing: "user-connection"})
            const result = await api.list()

            expectComplete(result, [])
        })

        it("returns client errors unchanged", async () => {
            const clientError = {
                code: LinearGqlClientErrorCode.HttpError,
                errorMessage: "Unauthorized",
            }
            mockLinearGqlClient.mockResolvedValue(errored(clientError))

            const api = createLabelApi({requestUsing: "user-connection"})
            const result = await api.list()

            expect(isErrored(result)).toBe(true)
            if (isErrored(result)) {
                expect(result.error).toEqual(clientError)
            }
        })
    })
})
