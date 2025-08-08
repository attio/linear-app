import type {DecoratedComboboxOptionsProvider} from "attio/client"
import getTeam from "../../linear/teams/get-team.server"
import getTeams from "../../linear/teams/get-teams.server"
import type {LinearTeam} from "../../linear/teams/schema"
import searchTeams from "../../linear/teams/search-teams.server"

export const teamsProvider: DecoratedComboboxOptionsProvider = {
    async getOption(value) {
        if (!value.trim()) {
            // gotta trim because we're using " " as a default value to pass validation
            return undefined
        }

        const team = await getTeam(value)
        return team ? {label: team.name, color: team.color} : undefined
    },

    async search(query) {
        if (query.length === 0) {
            const teams = await getTeams()
            return toOptions(teams)
        }
        const teams = await searchTeams(query)
        return teams.map((team) => ({
            label: team.name,
            value: team.id,
            color: team.color,
        }))
    },
}

function toOptions(teams: LinearTeam[]) {
    return teams.map((team) => ({
        label: team.name,
        value: team.id,
        color: team.color,
    }))
}
