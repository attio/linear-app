import {Workflows} from "attio"

export default Workflows.defineWorkflowBlock({
    type: "step",
    id: "update-issue",
    title: "Update issue",
    description: "Update an existing issue in Linear",
    configSchema: Workflows.ConfigSchema.struct({
        issueId: Workflows.ConfigSchema.string(),
        teamId: Workflows.ConfigSchema.string().optional(),
        projectId: Workflows.ConfigSchema.string().optional(),
        title: Workflows.ConfigSchema.string().optional(),
        description: Workflows.ConfigSchema.string().optional(),
        stateId: Workflows.ConfigSchema.string().optional(),
        priority: Workflows.ConfigSchema.string().optional(),
        assigneeId: Workflows.ConfigSchema.string().optional(),
        labelIds: Workflows.ConfigSchema.string().optional(),
    }),
})
