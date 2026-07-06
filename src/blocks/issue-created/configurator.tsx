import {Workflows} from "attio/client"
import {issueEventOutcomeSchema} from "../../utils/blocks/issue-outcome-schema"
import {usePlainProvider} from "../../utils/hooks/use-plain-provider"
import {useTeamsProjectsProvider} from "../../utils/hooks/use-teams-projects-provider"
import block from "./block"

export default Workflows.defineConfigurator(block, (workflowBlock) => {
    const {ComboboxInput, Outcome} = Workflows.useConfigurator(workflowBlock.configSchema)

    const teamsProjectsProvider = usePlainProvider(useTeamsProjectsProvider("workspace-connection"))

    return (
        <>
            <ComboboxInput name="scope" label="Team or project" options={teamsProjectsProvider} />
            <Outcome id="triggered" schema={issueEventOutcomeSchema} />
        </>
    )
})
