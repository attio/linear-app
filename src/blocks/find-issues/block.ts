import {Workflows} from "attio"

export default Workflows.defineWorkflowBlock({
    type: "step",
    id: "find-issues",
    title: "Find issues",
    description: "Search for issues in Linear",
    configSchema: Workflows.ConfigSchema.struct({
        query: Workflows.ConfigSchema.string(),
    }),
})
