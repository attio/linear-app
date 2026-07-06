import {complete, errored, type Fetchable, isComplete, isErrored} from "@attio/fetchable"
import {beforeEach, describe, expect, it, vi} from "vitest"
import {LinearGqlClientErrorCode} from "../client/linear-gql-client"
import {createOrganizationApi, getOrganizationQuery} from "./api"

vi.mock("../client/linear-gql-client")

import {linearGqlClient} from "../client/linear-gql-client"

const mockLinearGqlClient = vi.mocked(linearGqlClient)

const organization = {
    urlKey: "acme",
    customersEnabled: true,
}

function expectComplete<T>(result: Fetchable<T, unknown>, expected: T) {
    expect(isComplete(result)).toBe(true)
    if (isComplete(result)) {
        expect(result.value).toEqual(expected)
    }
}

describe("createOrganizationApi", () => {
    beforeEach(() => {
        mockLinearGqlClient.mockReset()
    })

    it("requests the organization", async () => {
        mockLinearGqlClient.mockResolvedValue(complete({organization}))

        const api = createOrganizationApi({requestUsing: "user-connection"})
        await api.get()

        const [request, options] = mockLinearGqlClient.mock.calls[0]
        expect(request).toMatchObject({query: getOrganizationQuery})
        expect(options).toMatchObject({requestUsing: "user-connection"})
    })

    it("returns the parsed organization", async () => {
        mockLinearGqlClient.mockResolvedValue(complete({organization}))

        const api = createOrganizationApi({requestUsing: "user-connection"})
        const result = await api.get()

        expectComplete(result, organization)
    })

    it("returns client errors unchanged", async () => {
        const clientError = {
            code: LinearGqlClientErrorCode.HttpError,
            errorMessage: "Unauthorized",
        }
        mockLinearGqlClient.mockResolvedValue(errored(clientError))

        const api = createOrganizationApi({requestUsing: "user-connection"})
        const result = await api.get()

        expect(isErrored(result)).toBe(true)
        if (isErrored(result)) {
            expect(result.error).toEqual(clientError)
        }
    })
})
