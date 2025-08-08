import type {FormApi} from "attio/client"
import type {LogCustomerRequestFormSchema} from "../log-customer-request-dialog"
import {projectsIssuesProvider} from "./projects-issues-options-provider"

export function ProjectIssuesCombobox({
    Combobox,
}: {
    Combobox: FormApi<LogCustomerRequestFormSchema>["Combobox"]
}) {
    return (
        <Combobox
            label="Add request to"
            name="addTo"
            __experimental_decorated
            options={projectsIssuesProvider}
            placeholder="Select a project or issue..."
            searchPlaceholder="Search projects and issues..."
        />
    )
}
