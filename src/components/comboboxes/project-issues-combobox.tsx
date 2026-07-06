import type {FormApi} from "attio/client"
import {useProjectsIssuesProvider} from "../../utils/hooks/use-projects-issues-provider"
import type {LogCustomerRequestFormSchema} from "../log-customer-request-dialog"

export function ProjectIssuesCombobox({
    Combobox,
}: {
    Combobox: FormApi<LogCustomerRequestFormSchema>["Combobox"]
}) {
    const projectsIssuesProvider = useProjectsIssuesProvider("user-connection")

    return (
        <Combobox
            label="Add request to"
            name="addTo"
            decorated
            options={projectsIssuesProvider}
            placeholder="Select a project or issue..."
            searchPlaceholder="Search projects and issues..."
        />
    )
}
