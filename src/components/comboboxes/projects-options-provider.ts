import type {DecoratedComboboxOptionsProvider} from "attio/client"
import getProject from "../../linear/projects/get-project.server"
import getProjects from "../../linear/projects/get-projects.server"
import type {LinearProject} from "../../linear/projects/schema"
import searchProjects from "../../linear/projects/search-projects.server"

export const projectsProvider: DecoratedComboboxOptionsProvider = {
    async getOption(value) {
        if (!value) {
            return undefined
        }

        const project = await getProject(value)
        return project ? {label: project.name, color: project.color} : undefined
    },

    async search(query) {
        if (query.length === 0) {
            const projects = await getProjects()
            return toOptions(projects)
        }
        const projects = await searchProjects(query)
        return toOptions(projects)
    },
}

function toOptions(projects: LinearProject[]) {
    return [
        ...projects.map((project) => ({
            label: project.name,
            value: project.id,
            color: project.color,
        })),
    ]
}
