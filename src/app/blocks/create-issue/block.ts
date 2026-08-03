import {Workflows} from "attio"

export default Workflows.defineWorkflowBlock({
    type: "step",
    id: "create-issue",
    title: "Create issue",
    description: "Create a new issue in Linear",
    configSchema: Workflows.ConfigSchema.struct({
        teamId: Workflows.ConfigSchema.string(),
        projectId: Workflows.ConfigSchema.string(),
        title: Workflows.ConfigSchema.string(),
        description: Workflows.ConfigSchema.string().optional(),
        stateId: Workflows.ConfigSchema.string().optional(),
        priority: Workflows.ConfigSchema.string().optional(),
        assigneeId: Workflows.ConfigSchema.string().optional(),
        labelIds: Workflows.ConfigSchema.string().optional(),
    }),
})
