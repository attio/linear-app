import {isComplete} from "@attio/fetchable"
import type {DecoratedComboboxOptionsProvider} from "attio/client"
import type {PostToLinearOptions} from "../../linear"
import getProject from "../server/get-project.server"
import getProjects from "../server/get-projects.server"
import getTeam from "../server/get-team.server"
import getTeams from "../server/get-teams.server"
import searchProjects from "../server/search-projects.server"
import searchTeams from "../server/search-teams.server"

export function createTeamsProjectsProvider(
    options: PostToLinearOptions
): DecoratedComboboxOptionsProvider {
    return {
        async getOption(value) {
            const [type, id] = value.split(":")
            if (type === "team") {
                const result = await getTeam(id, options)
                if (!isComplete(result)) throw new Error(result.error.errorMessage)
                const team = result.value
                return team
                    ? {label: team.name, categoryLabel: "Teams", color: team.color}
                    : undefined
            }
            if (type === "project") {
                const result = await getProject(id, options)
                if (!isComplete(result)) throw new Error(result.error.errorMessage)
                const project = result.value
                return project
                    ? {label: project.name, categoryLabel: "Projects", color: project.color}
                    : undefined
            }
            return undefined
        },

        async search(query) {
            const [teamsResult, projectsResult] = await Promise.all([
                query.length === 0 ? getTeams(options) : searchTeams(query, options),
                query.length === 0 ? getProjects(options) : searchProjects(query, options),
            ])
            if (!isComplete(teamsResult)) throw new Error(teamsResult.error.errorMessage)
            if (!isComplete(projectsResult)) throw new Error(projectsResult.error.errorMessage)
            return [
                ...teamsResult.value.map((t) => ({
                    label: t.name,
                    value: `team:${t.id}`,
                    categoryLabel: "Teams",
                    color: t.color,
                })),
                ...projectsResult.value.map((p) => ({
                    label: p.name,
                    value: `project:${p.id}`,
                    categoryLabel: "Projects",
                    color: p.color,
                })),
            ]
        },
    }
}
