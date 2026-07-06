import type {FormApi} from "attio/client"
import {useCompaniesProvider} from "../../utils/hooks/use-companies-provider"
import type {LogCustomerRequestFormSchema} from "../log-customer-request-dialog"

export function CompaniesCombobox({
    Combobox,
    companyId,
}: {
    Combobox: FormApi<LogCustomerRequestFormSchema>["Combobox"]
    companyId?: string
}) {
    const companiesProvider = useCompaniesProvider()

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
