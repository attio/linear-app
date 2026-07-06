import {complete} from "@attio/fetchable"
import {beforeEach, describe, expect, it, vi} from "vitest"
import getIssues from "../server/get-issues.server"
import getProjects from "../server/get-projects.server"
import {mockLinearIssue, mockLinearProject} from "../test/linear-mocks"
import {useProjectsIssuesProvider} from "./use-projects-issues-provider"

vi.mock("react", () => ({useMemo: (fn: () => unknown) => fn()}))
vi.mock("../server/get-issue.server", () => ({default: vi.fn()}))
vi.mock("../server/get-issues.server", () => ({default: vi.fn()}))
vi.mock("../server/get-project.server", () => ({default: vi.fn()}))
vi.mock("../server/get-projects.server", () => ({default: vi.fn()}))
vi.mock("../server/search-issues.server", () => ({default: vi.fn()}))
vi.mock("../server/search-projects.server", () => ({default: vi.fn()}))

const mockGetProjects = vi.mocked(getProjects)
const mockGetIssues = vi.mocked(getIssues)

const project = mockLinearProject()
const issue = mockLinearIssue()

describe(useProjectsIssuesProvider, () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it("returns a decorated provider with icon on getOption", async () => {
        const provider = useProjectsIssuesProvider("workspace-connection")
        const option = await provider.getOption("NEW")

        expect(option).toEqual({
            label: "Create new issue",
            categoryLabel: "",
            icon: "NotePlus",
        })
    })

    it("returns decorated options with icon on search", async () => {
        mockGetProjects.mockResolvedValue(complete([project]))
        mockGetIssues.mockResolvedValue(complete([issue]))

        const provider = useProjectsIssuesProvider("workspace-connection")
        const results = await provider.search("")

        expect(results[0]).toMatchObject({icon: "NotePlus"})
    })

    it("forwards the connection option on search", async () => {
        mockGetProjects.mockResolvedValue(complete([]))
        mockGetIssues.mockResolvedValue(complete([]))

        const provider = useProjectsIssuesProvider("workspace-connection")
        await provider.search("")

        expect(mockGetProjects).toHaveBeenCalledWith({
            requestUsing: "workspace-connection",
            showCreateNewOption: true,
        })
        expect(mockGetIssues).toHaveBeenCalledWith({
            requestUsing: "workspace-connection",
            showCreateNewOption: true,
        })
    })

    it("omits the create new issue option when showCreateNewOption is false", async () => {
        mockGetProjects.mockResolvedValue(complete([project]))
        mockGetIssues.mockResolvedValue(complete([issue]))

        const provider = useProjectsIssuesProvider("workspace-connection", {
            showCreateNewOption: false,
        })
        const results = await provider.search("")

        expect(results.map((option) => option.value)).not.toContain("NEW")
    })
})
