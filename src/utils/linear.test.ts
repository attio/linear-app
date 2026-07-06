import {describe, expect, it} from "vitest"
import type {LinearIssue} from "../linear"
import {issueToOutputData, parseProjectIdFromValue} from "./linear"

function createIssue(overrides: Partial<LinearIssue> = {}): LinearIssue {
    return {
        id: " issue-id ",
        title: "Issue title",
        identifier: "PROJ-123",
        description: "Issue description",
        priority: 2,
        dueDate: "2026-06-30",
        state: {
            id: " state-id ",
            name: "Todo",
            color: "#ffffff",
            type: "unstarted",
        },
        assignee: {
            id: " assignee-id ",
            name: "Victor",
            email: "victor@example.com",
        },
        labels: {
            nodes: [
                {id: "label-1", name: "Bug", color: "#f00"},
                {id: "label-2", name: "Customer", color: "#0f0"},
            ],
        },
        ...overrides,
    }
}

describe("issueToOutputData", () => {
    it("maps and normalizes issue fields", () => {
        const issue = createIssue()

        expect(issueToOutputData(issue)).toEqual({
            issue_id: "issue-id",
            title: "Issue title",
            identifier: "PROJ-123",
            description: "Issue description",
            status_name: "Todo",
            status_id: "state-id",
            priority: 2,
            due_date: "2026-06-30",
            assignee_id: "assignee-id",
            assignee_name: "Victor",
            labels: ["Bug", "Customer"],
        })
    })

    it("returns undefined for nullable fields", () => {
        const issue = createIssue({
            description: null,
            dueDate: null,
            state: null,
            assignee: null,
        })

        expect(issueToOutputData(issue)).toEqual({
            issue_id: "issue-id",
            title: "Issue title",
            identifier: "PROJ-123",
            description: undefined,
            status_name: undefined,
            status_id: undefined,
            priority: 2,
            due_date: undefined,
            assignee_id: undefined,
            assignee_name: undefined,
            labels: ["Bug", "Customer"],
        })
    })
})

describe("parseProjectIdFromValue", () => {
    it("returns project id when value is project-prefixed", () => {
        expect(parseProjectIdFromValue("project:project-123")).toBe("project-123")
    })

    it("returns undefined for missing or non-project values", () => {
        expect(parseProjectIdFromValue(undefined)).toBeUndefined()
        expect(parseProjectIdFromValue("team:team-123")).toBeUndefined()
    })
})
