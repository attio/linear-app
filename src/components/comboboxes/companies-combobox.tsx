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
                options={companiesProvider}
                __experimental_decorated
                disabled
            />
        )
    }
    return (
        <Combobox
            label="Company"
            name="companyRecordId"
            __experimental_decorated
            options={companiesProvider}
            placeholder="Select a company..."
            searchPlaceholder="Search companies..."
        />
    )
}
