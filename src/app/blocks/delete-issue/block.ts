import {Workflows} from "attio"

export default Workflows.defineWorkflowBlock({
    type: "step",
    id: "delete-issue",
    title: "Delete issue",
    description: "Delete an issue in Linear",
    configSchema: Workflows.ConfigSchema.struct({
        issueId: Workflows.ConfigSchema.string(),
    }),
})
