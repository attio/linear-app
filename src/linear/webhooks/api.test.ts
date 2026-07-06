import {complete, errored, type Fetchable, isComplete, isErrored} from "@attio/fetchable"
import {beforeEach, describe, expect, it, vi} from "vitest"
import {LinearGqlClientErrorCode} from "../client/linear-gql-client"
import {createWebhookApi, createWebhookQuery, deleteWebhookQuery} from "./api"

vi.mock("../client/linear-gql-client")

import {linearGqlClient} from "../client/linear-gql-client"

const mockLinearGqlClient = vi.mocked(linearGqlClient)

const webhook = {id: "webhook-1"}

function expectComplete<T>(result: Fetchable<T, unknown>, expected: T) {
    expect(isComplete(result)).toBe(true)
    if (isComplete(result)) {
        expect(result.value).toEqual(expected)
    }
}

describe("createWebhookApi", () => {
    beforeEach(() => {
        mockLinearGqlClient.mockReset()
    })

    describe("create", () => {
        const input = {
            url: "https://example.com/webhook",
            label: "Test webhook",
            resourceType: "Issue",
            teamId: "team-1",
        }

        it("sends the create webhook mutation", async () => {
            mockLinearGqlClient.mockResolvedValue(
                complete({webhookCreate: {success: true, webhook}})
            )

            const api = createWebhookApi({requestUsing: "workspace-connection"})
            await api.create(input)

            const [request, options] = mockLinearGqlClient.mock.calls[0]
            expect(request).toMatchObject({
                query: createWebhookQuery,
                variables: {
                    input: {
                        url: input.url,
                        label: input.label,
                        resourceTypes: [input.resourceType],
                        enabled: true,
                        teamId: input.teamId,
                    },
                },
            })
            expect(options).toMatchObject({requestUsing: "workspace-connection"})
        })

        it("returns the created webhook", async () => {
            mockLinearGqlClient.mockResolvedValue(
                complete({webhookCreate: {success: true, webhook}})
            )

            const api = createWebhookApi({requestUsing: "workspace-connection"})
            const result = await api.create(input)

            expectComplete(result, webhook)
        })

        it("returns a mutation error when creation fails", async () => {
            mockLinearGqlClient.mockResolvedValue(
                complete({webhookCreate: {success: false, webhook: null}})
            )

            const api = createWebhookApi({requestUsing: "workspace-connection"})
            const result = await api.create(input)

            expect(isErrored(result)).toBe(true)
            if (isErrored(result)) {
                expect(result.error).toEqual({
                    code: LinearGqlClientErrorCode.MutationError,
                    errorMessage: "Failed to create webhook",
                })
            }
        })

        it("returns client errors unchanged", async () => {
            const clientError = {
                code: LinearGqlClientErrorCode.HttpError,
                errorMessage: "Unauthorized",
            }
            mockLinearGqlClient.mockResolvedValue(errored(clientError))

            const api = createWebhookApi({requestUsing: "workspace-connection"})
            const result = await api.create(input)

            expect(isErrored(result)).toBe(true)
            if (isErrored(result)) {
                expect(result.error).toEqual(clientError)
            }
        })
    })

    describe("delete", () => {
        it("sends the delete webhook mutation", async () => {
            mockLinearGqlClient.mockResolvedValue(complete({webhookDelete: {success: true}}))

            const api = createWebhookApi({requestUsing: "workspace-connection"})
            await api.delete("webhook-1")

            const [request, options] = mockLinearGqlClient.mock.calls[0]
            expect(request).toMatchObject({
                query: deleteWebhookQuery,
                variables: {id: "webhook-1"},
            })
            expect(options).toMatchObject({requestUsing: "workspace-connection"})
        })

        it("returns undefined on success", async () => {
            mockLinearGqlClient.mockResolvedValue(complete({webhookDelete: {success: true}}))

            const api = createWebhookApi({requestUsing: "workspace-connection"})
            const result = await api.delete("webhook-1")

            expectComplete(result, undefined)
        })

        it("returns a mutation error when deletion fails", async () => {
            mockLinearGqlClient.mockResolvedValue(complete({webhookDelete: {success: false}}))

            const api = createWebhookApi({requestUsing: "workspace-connection"})
            const result = await api.delete("webhook-1")

            expect(isErrored(result)).toBe(true)
            if (isErrored(result)) {
                expect(result.error).toEqual({
                    code: LinearGqlClientErrorCode.MutationError,
                    errorMessage: "Failed to delete webhook",
                })
            }
        })
    })
})
