import {complete, errored, type Fetchable, isComplete, isErrored} from "@attio/fetchable"
import {beforeEach, describe, expect, it, vi} from "vitest"
import {LinearGqlClientErrorCode} from "../client/linear-gql-client"
import {createCustomerNeedApi, createCustomerNeedQuery, getCustomerNeedsQuery} from "./api"

vi.mock("../client/linear-gql-client")

import {linearGqlClient} from "../client/linear-gql-client"

const mockLinearGqlClient = vi.mocked(linearGqlClient)

const need = {id: "need-1"}

function expectComplete<T>(result: Fetchable<T, unknown>, expected: T) {
    expect(isComplete(result)).toBe(true)
    if (isComplete(result)) {
        expect(result.value).toEqual(expected)
    }
}

describe("createCustomerNeedApi", () => {
    beforeEach(() => {
        mockLinearGqlClient.mockReset()
    })

    describe("create", () => {
        const input = {
            body: "We need this feature",
            customerId: "customer-1",
        }

        it("sends the create customer need mutation", async () => {
            mockLinearGqlClient.mockResolvedValue(
                complete({customerNeedCreate: {success: true, need}})
            )

            const api = createCustomerNeedApi({requestUsing: "user-connection"})
            await api.create(input)

            const [request, options] = mockLinearGqlClient.mock.calls[0]
            expect(request).toMatchObject({
                query: createCustomerNeedQuery,
                variables: {input},
            })
            expect(options).toMatchObject({requestUsing: "user-connection"})
        })

        it("returns the created need", async () => {
            mockLinearGqlClient.mockResolvedValue(
                complete({customerNeedCreate: {success: true, need}})
            )

            const api = createCustomerNeedApi({requestUsing: "user-connection"})
            const result = await api.create(input)

            expectComplete(result, need)
        })

        it("returns a mutation error when creation fails", async () => {
            mockLinearGqlClient.mockResolvedValue(
                complete({customerNeedCreate: {success: false, need: null}})
            )

            const api = createCustomerNeedApi({requestUsing: "user-connection"})
            const result = await api.create(input)

            expect(isErrored(result)).toBe(true)
            if (isErrored(result)) {
                expect(result.error).toEqual({
                    code: LinearGqlClientErrorCode.MutationError,
                    errorMessage: "Failed to create customer need",
                })
            }
        })

        it("returns client errors unchanged", async () => {
            const clientError = {
                code: LinearGqlClientErrorCode.HttpError,
                errorMessage: "Unauthorized",
            }
            mockLinearGqlClient.mockResolvedValue(errored(clientError))

            const api = createCustomerNeedApi({requestUsing: "user-connection"})
            const result = await api.create(input)

            expect(isErrored(result)).toBe(true)
            if (isErrored(result)) {
                expect(result.error).toEqual(clientError)
            }
        })
    })

    describe("getCount", () => {
        it("requests customer needs by customer id", async () => {
            mockLinearGqlClient.mockResolvedValue(complete({customerNeeds: {nodes: [need]}}))

            const api = createCustomerNeedApi({requestUsing: "user-connection"})
            await api.getCount("customer-1")

            const [request, options] = mockLinearGqlClient.mock.calls[0]
            expect(request).toMatchObject({
                query: getCustomerNeedsQuery,
                variables: {customerId: "customer-1"},
            })
            expect(options).toMatchObject({requestUsing: "user-connection"})
        })

        it("returns the count of needs", async () => {
            mockLinearGqlClient.mockResolvedValue(
                complete({customerNeeds: {nodes: [need, {id: "need-2"}]}})
            )

            const api = createCustomerNeedApi({requestUsing: "user-connection"})
            const result = await api.getCount("customer-1")

            expectComplete(result, 2)
        })

        it("returns zero when no needs", async () => {
            mockLinearGqlClient.mockResolvedValue(complete({customerNeeds: {nodes: []}}))

            const api = createCustomerNeedApi({requestUsing: "user-connection"})
            const result = await api.getCount("customer-1")

            expectComplete(result, 0)
        })

        it("returns client errors unchanged", async () => {
            const clientError = {
                code: LinearGqlClientErrorCode.HttpError,
                errorMessage: "Unauthorized",
            }
            mockLinearGqlClient.mockResolvedValue(errored(clientError))

            const api = createCustomerNeedApi({requestUsing: "user-connection"})
            const result = await api.getCount("customer-1")

            expect(isErrored(result)).toBe(true)
            if (isErrored(result)) {
                expect(result.error).toEqual(clientError)
            }
        })
    })
})
