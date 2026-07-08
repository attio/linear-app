import {isComplete, isErrored} from "@attio/fetchable"
import {describe, expect, it} from "vitest"
import {z} from "zod"
import {mockLinearIssue} from "../../utils/test/linear-mocks"
import {linearIssueSchema} from "../issues/schema"
import {LinearGqlClientErrorCode, validateGqlResponse} from "./linear-gql-client"

const issue = mockLinearIssue()

const getIssueDataSchema = z.object({issue: linearIssueSchema.nullable()})

describe("validateGqlResponse", () => {
    it("validates the response with the schema object via safeParse", () => {
        const result = validateGqlResponse(getIssueDataSchema, {data: {issue}})

        expect(isComplete(result)).toBe(true)
        if (isComplete(result)) {
            expect(result.value).toEqual({issue})
        }
    })

    it("returns a validation error when the data does not match the schema", () => {
        const result = validateGqlResponse(getIssueDataSchema, {
            data: {issue: {id: "issue-1"}},
        })

        expect(isErrored(result)).toBe(true)
        if (isErrored(result)) {
            expect(result.error).toEqual({
                code: LinearGqlClientErrorCode.ValidationError,
                errorMessage: expect.any(String),
            })
        }
    })

    it("returns a validation error when the response envelope is invalid", () => {
        const result = validateGqlResponse(getIssueDataSchema, {unexpected: true})

        expect(isErrored(result)).toBe(true)
        if (isErrored(result)) {
            expect(result.error.code).toBe(LinearGqlClientErrorCode.ValidationError)
        }
    })

    it("returns a mutation error when the response includes GraphQL errors", () => {
        const result = validateGqlResponse(getIssueDataSchema, {
            data: {issue},
            errors: [
                {
                    message: "Not authorized",
                    extensions: {userPresentableMessage: "You do not have access to this issue."},
                },
            ],
        })

        expect(isErrored(result)).toBe(true)
        if (isErrored(result)) {
            expect(result.error).toEqual({
                code: LinearGqlClientErrorCode.MutationError,
                errorMessage: "You do not have access to this issue.",
            })
        }
    })

    it("returns a mutation error when data is null and errors are present", () => {
        const result = validateGqlResponse(getIssueDataSchema, {
            data: null,
            errors: [
                {
                    message: "Invalid scope: `write` required",
                    extensions: {
                        type: "forbidden",
                        code: "FORBIDDEN",
                        statusCode: 403,
                        userError: true,
                    },
                },
            ],
        })

        expect(isErrored(result)).toBe(true)
        if (isErrored(result)) {
            expect(result.error).toEqual({
                code: LinearGqlClientErrorCode.MutationError,
                errorMessage: "Invalid scope: `write` required",
            })
        }
    })

    it("returns a mutation error when data key is absent and errors are present", () => {
        const result = validateGqlResponse(getIssueDataSchema, {
            errors: [
                {
                    message: "Invalid scope: `write` required",
                    extensions: {
                        type: "forbidden",
                        code: "FORBIDDEN",
                        statusCode: 403,
                        userError: true,
                    },
                },
            ],
        })

        expect(isErrored(result)).toBe(true)
        if (isErrored(result)) {
            expect(result.error).toEqual({
                code: LinearGqlClientErrorCode.MutationError,
                errorMessage: "Invalid scope: `write` required",
            })
        }
    })
})
