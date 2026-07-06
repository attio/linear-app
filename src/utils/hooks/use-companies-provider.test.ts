import {beforeEach, describe, expect, it, vi} from "vitest"
import {companiesProvider} from "../providers/companies-options-provider"
import {useCompaniesProvider} from "./use-companies-provider"

vi.mock("../providers/companies-options-provider", () => ({
    companiesProvider: {getOption: vi.fn(), search: vi.fn()},
}))

describe(useCompaniesProvider, () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it("returns the companies provider", () => {
        const result = useCompaniesProvider()

        expect(result).toBe(companiesProvider)
    })
})
