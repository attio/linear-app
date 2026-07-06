import type {LinearIssue} from "../linear"

export function issueToOutputData(issue: LinearIssue) {
    return {
        issue_id: issue.id.trim(),
        title: issue.title,
        identifier: issue.identifier,
        description: issue.description ?? undefined,
        status_name: issue.state?.name,
        status_id: issue.state?.id?.trim(),
        priority: issue.priority,
        due_date: issue.dueDate ?? undefined,
        assignee_id: issue.assignee?.id.trim(),
        assignee_name: issue.assignee?.name,
        labels: issue.labels.nodes.map((l) => l.name),
    }
}

export function parseProjectIdFromValue(value: string | undefined): string | undefined {
    if (!value) return undefined
    const [type, id] = value.split(":")
    return type === "project" ? id : undefined
}
