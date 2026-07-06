import {isComplete} from "@attio/fetchable"
import type {DecoratedComboboxOptionsProvider} from "attio/client"
import type {LinearIssue, LinearProject, PostToLinearOptions} from "../../linear"
import getIssue from "../server/get-issue.server"
import getIssues from "../server/get-issues.server"
import getProject from "../server/get-project.server"
import getProjects from "../server/get-projects.server"
import searchIssues from "../server/search-issues.server"
import searchProjects from "../server/search-projects.server"

function toOptions(projects: LinearProject[], issues: LinearIssue[], showCreateNewOption: boolean) {
    return [
        ...(showCreateNewOption
            ? [
                  {
                      label: "Create new issue",
                      value: "NEW",
                      categoryLabel: "",
                      icon: "NotePlus" as const,
                  },
              ]
            : []),
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

export function createProjectsIssuesProvider(
    options: PostToLinearOptions & {showCreateNewOption?: boolean}
): DecoratedComboboxOptionsProvider {
    const showCreateNewOption = options.showCreateNewOption ?? true

    return {
        async getOption(value) {
            if (value === "NEW") {
                if (!showCreateNewOption) return undefined
                return {label: "Create new issue", categoryLabel: "", icon: "NotePlus" as const}
            }
            const [type, id] = value.split(":")
            switch (type) {
                case "project": {
                    const result = await getProject(id, options)
                    if (!isComplete(result)) throw new Error(result.error.errorMessage)
                    if (result.value === null) return undefined
                    return {
                        label: result.value.name,
                        categoryLabel: "Projects",
                        icon: "Workspace",
                    }
                }
                case "issue": {
                    const result = await getIssue(id, options)
                    if (!isComplete(result)) throw new Error(result.error.errorMessage)
                    if (result.value === null) return undefined
                    return {
                        label: result.value.title,
                        categoryLabel: "Issues",
                        description: result.value.identifier,
                        icon: "Note",
                    }
                }
                default: {
                    return undefined
                }
            }
        },

        async search(query) {
            if (query.length === 0) {
                const [projectsResult, issuesResult] = await Promise.all([
                    getProjects(options),
                    getIssues(options),
                ])
                if (!isComplete(projectsResult)) throw new Error(projectsResult.error.errorMessage)
                if (!isComplete(issuesResult)) throw new Error(issuesResult.error.errorMessage)
                return toOptions(projectsResult.value, issuesResult.value, showCreateNewOption)
            }
            const [projectsResult, issuesResult] = await Promise.all([
                searchProjects(query, options),
                searchIssues(query, options),
            ])
            if (!isComplete(projectsResult)) throw new Error(projectsResult.error.errorMessage)
            if (!isComplete(issuesResult)) throw new Error(issuesResult.error.errorMessage)
            return toOptions(projectsResult.value, issuesResult.value, showCreateNewOption)
        },
    }
}
