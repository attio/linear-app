import type {FormApi} from "attio/client"
import type {LogCustomerRequestFormSchema} from "../log-customer-request-dialog"
import {companiesProvider} from "./companies-options-provider"

export function CompaniesCombobox({
    Combobox,
    companyId,
}: {
    Combobox: FormApi<LogCustomerRequestFormSchema>["Combobox"]
    companyId?: string
}) {
    if (companyId) {
        return (
            <Combobox
                label="Company"
                name="companyRecordId"
                decorated
                options={companiesProvider}
                disabled
            />
        )
    }
    return (
        <Combobox
            label="Company"
            name="companyRecordId"
            decorated
            options={companiesProvider}
            placeholder="Select a company..."
            searchPlaceholder="Search companies..."
        />
    )
}
