import type {FormApi} from "attio/client"
import {useTeamsProvider} from "../../utils/hooks/use-teams-provider"
import type {LogCustomerRequestFormSchema} from "../log-customer-request-dialog"

export function TeamsCombobox({
    Combobox,
}: {
    Combobox: FormApi<LogCustomerRequestFormSchema>["Combobox"]
}) {
    const teamsProvider = useTeamsProvider("user-connection")

    return (
        <Combobox
            label="Team"
            name="team"
            decorated
            options={teamsProvider}
            searchPlaceholder="Search teams..."
            placeholder="Select a team..."
        />
    )
}
