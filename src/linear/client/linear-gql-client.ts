import {type AsyncResult, complete, errored, isErrored, type Result} from "@attio/fetchable"
import {getUserConnection, getWorkspaceConnection} from "attio/server"
import type {z} from "zod"
import {createLogger} from "../../utils/logger"
import {linearGqlResponseSchema} from "./schema"

const LINEAR_GRAPHQL_URL = "https://api.linear.app/graphql"

const logger = createLogger("linearGqlClient")

function getOperationName(request: unknown): string {
    if (
        typeof request === "object" &&
        request !== null &&
        "query" in request &&
        typeof request.query === "string"
    ) {
        return request.query.match(/(?:query|mutation|subscription)\s+(\w+)/)?.[1] ?? "unknown"
    }

    return "unknown"
}

function networkErrorMessage(cause: unknown): string {
    if (cause instanceof Error) return cause.message
    return String(cause)
}

export type PostToLinearOptions = {
    requestUsing: "workspace-connection" | "user-connection"
}

export enum LinearGqlClientErrorCode {
    HttpError = "http_error",
    NetworkError = "network_error",
    ValidationError = "validation_error",
    MutationError = "mutation_error",
}

export type LinearGqlClientError = {
    code: LinearGqlClientErrorCode
    errorMessage: string
}

export function validateGqlResponse<TDataSchema extends z.ZodType>(
    schema: TDataSchema,
    json: unknown
): Result<z.infer<TDataSchema>, LinearGqlClientError> {
    const parsed = linearGqlResponseSchema(schema).safeParse(json)

    if (!parsed.success) {
        return errored({
            code: LinearGqlClientErrorCode.ValidationError,
            errorMessage: parsed.error.message,
        })
    }

    const {data, errors} = parsed.data as {
        data: z.infer<TDataSchema>
        errors?: Array<{
            message?: string
            extensions?: {userPresentableMessage?: string}
        }>
    }

    if (errors && errors.length > 0) {
        const errorMessage = errors
            .map(
                (error) =>
                    error.extensions?.userPresentableMessage ??
                    error.message ??
                    "GraphQL request failed"
            )
            .join("; ")

        return errored({
            code: LinearGqlClientErrorCode.MutationError,
            errorMessage,
        })
    }

    return complete(data)
}

export async function linearGqlClient<TDataSchema extends z.ZodType>(
    request: unknown,
    options: {requestUsing: PostToLinearOptions["requestUsing"]; schema: TDataSchema}
): AsyncResult<z.infer<TDataSchema>, LinearGqlClientError> {
    const requestUsing = options.requestUsing
    const connection =
        requestUsing === "workspace-connection" ? getWorkspaceConnection() : getUserConnection()

    const operationName = getOperationName(request)

    let response: Response
    try {
        response = await fetch(LINEAR_GRAPHQL_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${connection.value}`,
            },
            body: JSON.stringify(request),
        })
    } catch (cause) {
        logger.error("request failed", {operationName, cause})
        return errored({
            code: LinearGqlClientErrorCode.NetworkError,
            errorMessage: networkErrorMessage(cause),
        })
    }

    if (!response.ok) {
        const body = await response.text()
        logger.error("request failed", {operationName, status: response.status})
        return errored({
            code: LinearGqlClientErrorCode.HttpError,
            errorMessage: body || `Request failed with status ${response.status}`,
        })
    }

    let json: unknown
    try {
        json = await response.json()
    } catch (cause) {
        logger.error("response parse failed", {operationName, cause})
        return errored({
            code: LinearGqlClientErrorCode.ValidationError,
            errorMessage: "Failed to parse response body",
        })
    }

    const validated = validateGqlResponse(options.schema, json)

    if (isErrored(validated)) {
        logger.error("response validation failed", {operationName, error: validated.error})
        return validated
    }

    return validated
}

export function createLinearGqlClient(options: PostToLinearOptions) {
    return <TDataSchema extends z.ZodType>(request: unknown, schema: TDataSchema) =>
        linearGqlClient(request, {requestUsing: options.requestUsing, schema})
}
