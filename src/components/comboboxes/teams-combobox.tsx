import type {FormApi} from "attio/client"
import type {LogCustomerRequestFormSchema} from "../log-customer-request-dialog"
import {teamsProvider} from "./teams-options-provider"

export function TeamsCombobox({
    Combobox,
}: {
    Combobox: FormApi<LogCustomerRequestFormSchema>["Combobox"]
}) {
    return (
        <Combobox
            label="Team"
            name="team"
            __experimental_decorated
            options={teamsProvider}
            searchPlaceholder="Search teams..."
            placeholder="Select a team..."
        />
    )
}
