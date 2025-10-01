import type { FormApi } from "attio/client";
import type { LogCustomerRequestFormSchema } from "../log-customer-request-dialog";

export function CompaniesCombobox({
  Combobox,
  companyId,
}: {
  Combobox: FormApi<LogCustomerRequestFormSchema>["Experimental_AttioRecordCombobox"];
  companyId?: string;
}) {
  if (companyId) {
    return (
      <Combobox
        label="Company"
        name="companyRecord"
        objectSlug="companies"
        disabled
      />
    );
  }
  return (
    <Combobox
      label="Company"
      name="companyRecord"
      objectSlug="companies"
      placeholder="Select a company..."
      searchPlaceholder="Search companies..."
    />
  );
}
