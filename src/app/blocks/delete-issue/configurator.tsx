import {Workflows} from "attio/client"
import block from "./block"

export default Workflows.defineConfigurator(block, (workflowBlock) => {
    const {TextInput, Outcome} = Workflows.useConfigurator(workflowBlock.configSchema)

    return (
        <>
            <TextInput name="issueId" label="Issue ID" />
            <Outcome id="success" schema={null} />
        </>
    )
})
