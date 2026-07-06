import {isComplete} from "@attio/fetchable"
import type {DecoratedComboboxOptionsProvider} from "attio/client"
import type {LinearTeam, PostToLinearOptions} from "../../linear"
import getTeam from "../server/get-team.server"
import getTeams from "../server/get-teams.server"
import searchTeams from "../server/search-teams.server"

function toOptions(teams: LinearTeam[]) {
    return teams.map((team) => ({
        label: team.name,
        value: team.id,
        color: team.color,
    }))
}

export function createTeamsProvider(
    options: PostToLinearOptions
): DecoratedComboboxOptionsProvider {
    return {
        async getOption(value) {
            if (!value.trim()) {
                // gotta trim because we're using " " as a default value to pass validation
                return undefined
            }

            const result = await getTeam(value, options)
            if (!isComplete(result)) throw new Error(result.error.errorMessage)
            const team = result.value
            return team ? {label: team.name, color: team.color} : undefined
        },

        async search(query) {
            if (query.length === 0) {
                const result = await getTeams(options)
                if (!isComplete(result)) throw new Error(result.error.errorMessage)
                return toOptions(result.value)
            }
            const result = await searchTeams(query, options)
            if (!isComplete(result)) throw new Error(result.error.errorMessage)
            return result.value.map((team) => ({
                label: team.name,
                value: team.id,
                color: team.color,
            }))
        },
    }
}
