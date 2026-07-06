import {Workflows} from "attio"

export default Workflows.defineWorkflowBlock({
    type: "trigger",
    id: "issue-updated",
    title: "Issue updated",
    description: "Triggers when a Linear issue is updated in a team or project",
    configSchema: Workflows.ConfigSchema.struct({
        scope: Workflows.ConfigSchema.string(),
    }),
})
