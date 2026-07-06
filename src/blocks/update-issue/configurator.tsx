import {Workflows} from "attio/client"
import {AssigneeComboboxInput} from "../../components/comboboxes/assignee-combobox-input"
import {issueOutcomeSchema} from "../../utils/blocks/issue-outcome-schema"
import {useIssueLabelsProvider} from "../../utils/hooks/use-issue-labels-provider"
import {usePlainProvider} from "../../utils/hooks/use-plain-provider"
import {usePrioritiesProvider} from "../../utils/hooks/use-priorities-provider"
import {useProjectsIssuesProvider} from "../../utils/hooks/use-projects-issues-provider"
import {useTeamsProvider} from "../../utils/hooks/use-teams-provider"
import {useWorkflowStatesProvider} from "../../utils/hooks/use-workflow-states-provider"
import block from "./block"

export default Workflows.defineConfigurator(block, (workflowBlock) => {
    const {TextInput, ComboboxInput, Outcome, watch} = Workflows.useConfigurator(
        workflowBlock.configSchema
    )

    const teamIdConfig = watch("teamId")
    const teamId = teamIdConfig?.type === "static" ? teamIdConfig.value : undefined

    const teamsProvider = usePlainProvider(useTeamsProvider("workspace-connection"))
    const projectIssueProvider = usePlainProvider(
        useProjectsIssuesProvider("workspace-connection", {showCreateNewOption: false})
    )
    const workflowStatesProvider = usePlainProvider(
        useWorkflowStatesProvider("workspace-connection")
    )
    const issueLabelsProvider = usePlainProvider(useIssueLabelsProvider("workspace-connection"))
    const prioritiesProvider = usePrioritiesProvider()

    return (
        <>
            <TextInput name="issueId" label="Issue ID" />
            <ComboboxInput name="teamId" label="Team" options={teamsProvider} />
            <ComboboxInput
                name="projectId"
                label="Project or issue"
                placeholder="Select a project or issue"
                options={projectIssueProvider}
            />
            <TextInput name="title" label="Title" />
            <TextInput name="description" label="Description" />
            <ComboboxInput name="stateId" label="Status" options={workflowStatesProvider} />
            <ComboboxInput name="priority" label="Priority" options={prioritiesProvider} />
            {teamId && <AssigneeComboboxInput ComboboxInput={ComboboxInput} teamId={teamId} />}
            <ComboboxInput name="labelIds" label="Label" options={issueLabelsProvider} />
            <Outcome id="success" schema={issueOutcomeSchema} />
        </>
    )
})
