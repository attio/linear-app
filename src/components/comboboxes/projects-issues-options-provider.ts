import type {DecoratedComboboxOptionsProvider} from "attio/client"
import getIssue from "../../linear/issues/get-issue.server"
import getIssues from "../../linear/issues/get-issues.server"
import type {LinearIssue} from "../../linear/issues/schema"
import searchIssues from "../../linear/issues/search-issues.server"
import getProject from "../../linear/projects/get-project.server"
import getProjects from "../../linear/projects/get-projects.server"
import type {LinearProject} from "../../linear/projects/schema"
import searchProjects from "../../linear/projects/search-projects.server"

export const projectsIssuesProvider: DecoratedComboboxOptionsProvider = {
    async getOption(value) {
        const [type, id] = value.split(":")
        switch (type) {
            case "project": {
                const project = await getProject(id)
                if (project === null) {
                    throw new Error(`Project not found: ${id}`)
                }
                return {
                    label: project.name,
                    categoryLabel: "Projects",
                    icon: "Workspace",
                }
            }
            case "issue": {
                const issue = await getIssue(id)
                if (issue === null) {
                    throw new Error(`Issue not found: ${id}`)
                }
                return {
                    label: issue.title,
                    categoryLabel: "Issues",
                    description: issue.identifier,
                    icon: "Note",
                }
            }
            default: {
                throw new Error(`Unknown type: ${type}`)
            }
        }
    },

    async search(query) {
        if (query.length === 0) {
            const [projects, issues] = await Promise.all([getProjects(), getIssues()])

            return toOptions(projects, issues)
        }
        const [projects, issues] = await Promise.all([searchProjects(query), searchIssues(query)])
        return toOptions(projects, issues)
    },
}

function toOptions(projects: LinearProject[], issues: LinearIssue[]) {
    return [
        {
            label: "Create new issue",
            value: "NEW",
            categoryLabel: "",
            icon: "NotePlus" as const,
        },
        ...projects.map((project) => ({
            label: project.name,
            value: `project:${project.id}`,
            categoryLabel: "Projects",
            icon: "Workspace" as const,
        })),
        ...issues.map((issue) => ({
            label: issue.title,
            value: `issue:${issue.id}`,
            categoryLabel: "Issues",
            description: issue.identifier,
            icon: "Note" as const,
        })),
    ]
}
