import {type DecoratedComboboxOptionsProvider, runQuery} from "attio/client"
import GetCompanyByCompanyId from "../../graphql/get-company-by-id.graphql"
import SearchCompanies from "../../graphql/search-companies.graphql"

export const companiesProvider: DecoratedComboboxOptionsProvider = {
    async getOption(recordId) {
        const result = await runQuery(GetCompanyByCompanyId, {companyId: recordId})
        return result?.company
            ? result.company.logo_url
                ? {
                      label: result.company.name || "Unnamed Company",
                      description: result.company.domains[0],
                      avatarUrl: result.company.logo_url,
                  }
                : {
                      label: result.company.name || "Unnamed Company",
                      description: result.company.domains[0],
                      icon: "Company" as const,
                  }
            : undefined
    },

    async search(query: string) {
        const results = await runQuery(SearchCompanies, {query})

        return results.experimental_searchCompanies.map((company) => ({
            label: company.name || company.domains[0] || "",
            value: company.id,
            description: company.domains[0],
            ...(company.logo_url ? {avatarUrl: company.logo_url} : {icon: "Company"}),
        }))
    },
}
