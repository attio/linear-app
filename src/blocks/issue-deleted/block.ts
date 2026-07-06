import {Workflows} from "attio"

export default Workflows.defineWorkflowBlock({
    type: "trigger",
    id: "issue-deleted",
    title: "Issue deleted",
    description: "Triggers when a Linear issue is deleted in a team or project",
    configSchema: Workflows.ConfigSchema.struct({
        scope: Workflows.ConfigSchema.string(),
    }),
})
