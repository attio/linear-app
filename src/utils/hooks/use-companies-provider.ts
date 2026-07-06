import type {DecoratedComboboxOptionsProvider} from "attio/client"
import {companiesProvider} from "../providers/companies-options-provider"

export function useCompaniesProvider(): DecoratedComboboxOptionsProvider {
    return companiesProvider
}
