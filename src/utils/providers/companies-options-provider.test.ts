import {runQuery} from "attio/client"
import {beforeEach, describe, expect, it, vi} from "vitest"
import {companiesProvider} from "./companies-options-provider"

vi.mock("../../graphql/get-company-by-id.graphql", () => ({default: "GetCompanyByCompanyId"}))
vi.mock("../../graphql/search-companies.graphql", () => ({default: "SearchCompanies"}))
vi.mock("attio/client", () => ({
    runQuery: vi.fn(),
}))

const mockRunQuery = vi.mocked(runQuery)

describe("companiesProvider", () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it("returns an avatar option when the company has a logo", async () => {
        mockRunQuery.mockResolvedValue({
            company: {
                name: "Acme Corp",
                logo_url: "https://example.com/logo.png",
                domains: ["acme.com"],
            },
        })

        const option = await companiesProvider.getOption("company-1")

        expect(option).toEqual({
            label: "Acme Corp",
            description: "acme.com",
            avatarUrl: "https://example.com/logo.png",
        })
    })

    it("returns an icon option when the company has no logo", async () => {
        mockRunQuery.mockResolvedValue({
            company: {
                name: "Acme Corp",
                logo_url: null,
                domains: ["acme.com"],
            },
        })

        const option = await companiesProvider.getOption("company-1")

        expect(option).toEqual({
            label: "Acme Corp",
            description: "acme.com",
            icon: "Company",
        })
    })

    it("falls back to Unnamed Company when the company has no name", async () => {
        mockRunQuery.mockResolvedValue({
            company: {
                name: null,
                logo_url: null,
                domains: ["acme.com"],
            },
        })

        const option = await companiesProvider.getOption("company-1")

        expect(option).toEqual({
            label: "Unnamed Company",
            description: "acme.com",
            icon: "Company",
        })
    })

    it("returns undefined when the company is not found", async () => {
        mockRunQuery.mockResolvedValue({company: null})

        expect(await companiesProvider.getOption("company-1")).toBeUndefined()
    })

    it("maps search results with avatarUrl when a logo is present", async () => {
        mockRunQuery.mockResolvedValue({
            experimental_searchCompanies: [
                {
                    id: "company-1",
                    name: "Acme Corp",
                    domains: ["acme.com"],
                    logo_url: "https://example.com/logo.png",
                },
            ],
        })

        const results = await companiesProvider.search("acme")

        expect(mockRunQuery).toHaveBeenCalledWith(expect.anything(), {query: "acme"})
        expect(results).toEqual([
            {
                label: "Acme Corp",
                value: "company-1",
                description: "acme.com",
                avatarUrl: "https://example.com/logo.png",
            },
        ])
    })

    it("maps search results with icon when no logo is present", async () => {
        mockRunQuery.mockResolvedValue({
            experimental_searchCompanies: [
                {
                    id: "company-1",
                    name: null,
                    domains: ["acme.com"],
                    logo_url: null,
                },
            ],
        })

        const results = await companiesProvider.search("acme")

        expect(results).toEqual([
            {
                label: "acme.com",
                value: "company-1",
                description: "acme.com",
                icon: "Company",
            },
        ])
    })
})
