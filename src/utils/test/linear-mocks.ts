import type {
    LinearCustomer,
    LinearIssue,
    LinearIssueLabel,
    LinearProject,
    LinearTeam,
    LinearUser,
    LinearWorkflowState,
} from "../../linear"

export function mockLinearCustomer(overrides: Partial<LinearCustomer> = {}): LinearCustomer {
    return {
        id: "customer-1",
        name: "Acme Corp",
        logoUrl: null,
        externalIds: ["company-record-1"],
        ...overrides,
    }
}

export function mockLinearIssue(overrides: Partial<LinearIssue> = {}): LinearIssue {
    return {
        id: "issue-1",
        title: "Fix the dropdown",
        identifier: "ECO-4401",
        description: null,
        priority: 0,
        dueDate: null,
        state: null,
        assignee: null,
        labels: {nodes: []},
        ...overrides,
    }
}

export function mockLinearProject(overrides: Partial<LinearProject> = {}): LinearProject {
    return {
        id: "project-1",
        name: "Project One",
        color: "#bec2c8",
        ...overrides,
    }
}

export function mockLinearTeam(overrides: Partial<LinearTeam> = {}): LinearTeam {
    return {
        id: "team-1",
        name: "Engineering",
        color: "#26b5ce",
        ...overrides,
    }
}

export function mockLinearWorkflowState(
    overrides: Partial<LinearWorkflowState> = {}
): LinearWorkflowState {
    return {
        id: "state-1",
        name: "In Progress",
        description: null,
        color: "#f2c94c",
        position: 1,
        ...overrides,
    }
}

export function mockLinearIssueLabel(overrides: Partial<LinearIssueLabel> = {}): LinearIssueLabel {
    return {
        id: "label-1",
        name: "Bug",
        color: "#eb5757",
        ...overrides,
    }
}

export function mockLinearUser(overrides: Partial<LinearUser> = {}): LinearUser {
    return {
        id: "user-1",
        name: "Alice",
        avatarUrl: null,
        isMe: false,
        ...overrides,
    }
}
