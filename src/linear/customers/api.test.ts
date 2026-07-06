import {complete, errored, type Fetchable, isComplete, isErrored} from "@attio/fetchable"
import {beforeEach, describe, expect, it, vi} from "vitest"
import {mockLinearCustomer} from "../../utils/test/linear-mocks"
import {LinearGqlClientErrorCode} from "../client/linear-gql-client"
import {
    createCustomerApi,
    createCustomerQuery,
    getCustomerByCompanyRecordIdQuery,
    getCustomerByDomainsQuery,
    getCustomerByNameOrDomainsQuery,
    getCustomerByNameQuery,
    updateCustomerQuery,
} from "./api"

vi.mock("../client/linear-gql-client")

import {linearGqlClient} from "../client/linear-gql-client"

const mockLinearGqlClient = vi.mocked(linearGqlClient)

const customer = mockLinearCustomer()

function expectComplete<T>(result: Fetchable<T, unknown>, expected: T) {
    expect(isComplete(result)).toBe(true)
    if (isComplete(result)) {
        expect(result.value).toEqual(expected)
    }
}

describe("createCustomerApi", () => {
    beforeEach(() => {
        mockLinearGqlClient.mockReset()
    })

    describe("getByCompanyRecordId", () => {
        it("requests the customer by company record id", async () => {
            mockLinearGqlClient.mockResolvedValue(complete({customers: {nodes: [customer]}}))

            const api = createCustomerApi({requestUsing: "user-connection"})
            await api.getByCompanyRecordId("company-record-1")

            const [request, options] = mockLinearGqlClient.mock.calls[0]
            expect(request).toMatchObject({
                query: getCustomerByCompanyRecordIdQuery,
                variables: {companyRecordId: "company-record-1"},
            })
            expect(options).toMatchObject({requestUsing: "user-connection"})
        })

        it("returns the parsed customer", async () => {
            mockLinearGqlClient.mockResolvedValue(complete({customers: {nodes: [customer]}}))

            const api = createCustomerApi({requestUsing: "user-connection"})
            const result = await api.getByCompanyRecordId("company-record-1")

            expectComplete(result, customer)
        })

        it("returns null when the customer does not exist", async () => {
            mockLinearGqlClient.mockResolvedValue(complete({customers: {nodes: []}}))

            const api = createCustomerApi({requestUsing: "user-connection"})
            const result = await api.getByCompanyRecordId("missing")

            expectComplete(result, null)
        })

        it("returns client errors unchanged", async () => {
            const clientError = {
                code: LinearGqlClientErrorCode.HttpError,
                errorMessage: "Unauthorized",
            }
            mockLinearGqlClient.mockResolvedValue(errored(clientError))

            const api = createCustomerApi({requestUsing: "user-connection"})
            const result = await api.getByCompanyRecordId("company-record-1")

            expect(isErrored(result)).toBe(true)
            if (isErrored(result)) {
                expect(result.error).toEqual(clientError)
            }
        })
    })

    describe("getByNameOrDomains", () => {
        it("requests by name and domains when both are provided", async () => {
            mockLinearGqlClient.mockResolvedValue(complete({customers: {nodes: [customer]}}))

            const api = createCustomerApi({requestUsing: "user-connection"})
            await api.getByNameOrDomains("Acme Corp", ["acme.com"])

            const [request] = mockLinearGqlClient.mock.calls[0]
            expect(request).toMatchObject({
                query: getCustomerByNameOrDomainsQuery,
                variables: {name: "Acme Corp", domains: ["acme.com"]},
            })
        })

        it("requests by name only when domains are missing", async () => {
            mockLinearGqlClient.mockResolvedValue(complete({customers: {nodes: [customer]}}))

            const api = createCustomerApi({requestUsing: "user-connection"})
            await api.getByNameOrDomains("Acme Corp")

            const [request] = mockLinearGqlClient.mock.calls[0]
            expect(request).toMatchObject({
                query: getCustomerByNameQuery,
                variables: {name: "Acme Corp"},
            })
        })

        it("requests by domains only when name is missing", async () => {
            mockLinearGqlClient.mockResolvedValue(complete({customers: {nodes: [customer]}}))

            const api = createCustomerApi({requestUsing: "user-connection"})
            await api.getByNameOrDomains(undefined, ["acme.com"])

            const [request] = mockLinearGqlClient.mock.calls[0]
            expect(request).toMatchObject({
                query: getCustomerByDomainsQuery,
                variables: {domains: ["acme.com"]},
            })
        })

        it("returns an error when name and domains are missing", async () => {
            const api = createCustomerApi({requestUsing: "user-connection"})
            const result = await api.getByNameOrDomains()

            expect(isErrored(result)).toBe(true)
            if (isErrored(result)) {
                expect(result.error).toEqual({
                    code: LinearGqlClientErrorCode.MutationError,
                    errorMessage: "Company is missing name or domains",
                })
            }
        })
    })

    describe("create", () => {
        const input = {
            name: "Acme Corp",
            externalIds: ["company-record-1"],
        }

        it("sends the create customer mutation", async () => {
            mockLinearGqlClient.mockResolvedValue(
                complete({customerCreate: {success: true, customer}})
            )

            const api = createCustomerApi({requestUsing: "user-connection"})
            await api.create(input)

            const [request, options] = mockLinearGqlClient.mock.calls[0]
            expect(request).toMatchObject({
                query: createCustomerQuery,
                variables: {input},
            })
            expect(options).toMatchObject({requestUsing: "user-connection"})
        })

        it("returns the created customer", async () => {
            mockLinearGqlClient.mockResolvedValue(
                complete({customerCreate: {success: true, customer}})
            )

            const api = createCustomerApi({requestUsing: "user-connection"})
            const result = await api.create(input)

            expectComplete(result, customer)
        })

        it("returns a mutation error when creation fails", async () => {
            mockLinearGqlClient.mockResolvedValue(
                complete({customerCreate: {success: false, customer: null}})
            )

            const api = createCustomerApi({requestUsing: "user-connection"})
            const result = await api.create(input)

            expect(isErrored(result)).toBe(true)
            if (isErrored(result)) {
                expect(result.error).toEqual({
                    code: LinearGqlClientErrorCode.MutationError,
                    errorMessage: "Failed to create customer",
                })
            }
        })
    })

    describe("updateExternalIds", () => {
        it("sends the update customer mutation", async () => {
            mockLinearGqlClient.mockResolvedValue(complete({customerUpdate: {success: true}}))

            const api = createCustomerApi({requestUsing: "user-connection"})
            await api.updateExternalIds("customer-1", ["company-record-1"])

            const [request] = mockLinearGqlClient.mock.calls[0]
            expect(request).toMatchObject({
                query: updateCustomerQuery,
                variables: {id: "customer-1", input: {externalIds: ["company-record-1"]}},
            })
        })

        it("returns undefined on success", async () => {
            mockLinearGqlClient.mockResolvedValue(complete({customerUpdate: {success: true}}))

            const api = createCustomerApi({requestUsing: "user-connection"})
            const result = await api.updateExternalIds("customer-1", ["company-record-1"])

            expectComplete(result, undefined)
        })

        it("returns a mutation error when the update fails", async () => {
            mockLinearGqlClient.mockResolvedValue(complete({customerUpdate: {success: false}}))

            const api = createCustomerApi({requestUsing: "user-connection"})
            const result = await api.updateExternalIds("customer-1", ["company-record-1"])

            expect(isErrored(result)).toBe(true)
            if (isErrored(result)) {
                expect(result.error).toEqual({
                    code: LinearGqlClientErrorCode.MutationError,
                    errorMessage: "Failed to update customer external ids",
                })
            }
        })
    })
})
