import type {FormApi} from "attio/client"
import type {LogCustomerRequestFormSchema} from "../log-customer-request-dialog"

export function CompaniesCombobox({
    Combobox,
    companyId,
}: {
    Combobox: FormApi<LogCustomerRequestFormSchema>["Experimental_RecordCombobox"]
    companyId?: string
}) {
    if (companyId) {
        return <Combobox label="Company" name="companyRecordId" recordTypes="company" disabled />
    }
    return (
        <Combobox
            label="Company"
            name="companyRecordId"
            recordTypes="company"
            placeholder="Select a company..."
            searchPlaceholder="Search companies..."
        />
    )
}
