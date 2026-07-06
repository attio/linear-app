/* eslint-disable attio/server-default-export */
import {isComplete} from "@attio/fetchable"
import {linearApi} from "../../linear"

export async function resolveTeamId(
    scopeType: string,
    scopeId: string
): Promise<{teamId: string} | {error: string}> {
    if (scopeType === "team") {
        return {teamId: scopeId}
    }

    if (scopeType === "project") {
        const result = await linearApi({requestUsing: "workspace-connection"}).project.getTeamId(
            scopeId
        )

        if (!isComplete(result)) {
            return {error: `Failed to fetch project ${scopeId} from Linear`}
        }

        if (!result.value) {
            return {error: `Project ${scopeId} has no associated team`}
        }

        return {teamId: result.value}
    }

    return {error: `Unknown scope type "${scopeType}" — expected "team" or "project"`}
}
