import type {ElementType} from "react"
import {usePlainProvider} from "../../utils/hooks/use-plain-provider"
import {useUsersProvider} from "../../utils/hooks/use-users-provider"

type AssigneeComboboxInputProps = {
    ComboboxInput: ElementType
    teamId: string
}

export function AssigneeComboboxInput({ComboboxInput, teamId}: AssigneeComboboxInputProps) {
    const usersProvider = usePlainProvider(useUsersProvider(teamId, "workspace-connection"))

    return (
        <ComboboxInput
            name="assigneeId"
            label="Assignee"
            options={usersProvider}
            placeholder="Select an assignee..."
            searchPlaceholder="Search assignees..."
        />
    )
}
