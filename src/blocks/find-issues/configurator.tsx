import {Workflows} from "attio/client"
import {issueOutcomeSchema} from "../../utils/blocks/issue-outcome-schema"
import block from "./block"

export default Workflows.defineConfigurator(block, (workflowBlock) => {
    const {TextInput, Outcome} = Workflows.useConfigurator(workflowBlock.configSchema)

    return (
        <>
            <TextInput name="query" label="Search query" />
            <Outcome
                id="found"
                label="Found"
                schema={{
                    issues: Workflows.OutcomeSchema.array(issueOutcomeSchema),
                }}
            />
            <Outcome id="not-found" label="Not found" schema={null} />
        </>
    )
})
