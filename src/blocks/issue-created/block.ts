import {Workflows} from "attio"

export default Workflows.defineWorkflowBlock({
    type: "trigger",
    id: "issue-created",
    title: "Issue created",
    description: "Triggers when a Linear issue is created in a team or project",
    configSchema: Workflows.ConfigSchema.struct({
        scope: Workflows.ConfigSchema.string(),
    }),
})
