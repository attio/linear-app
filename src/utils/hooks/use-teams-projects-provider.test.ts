import {beforeEach, describe, expect, it, vi} from "vitest"
import {createTeamsProjectsProvider} from "../providers/teams-projects-options-provider"
import {useTeamsProjectsProvider} from "./use-teams-projects-provider"

vi.mock("react", () => ({useMemo: (fn: () => unknown) => fn()}))
vi.mock("../providers/teams-projects-options-provider", () => ({
    createTeamsProjectsProvider: vi.fn(),
}))

const mockCreateTeamsProjectsProvider = vi.mocked(createTeamsProjectsProvider)

describe(useTeamsProjectsProvider, () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it("returns a decorated provider from createTeamsProjectsProvider", () => {
        const provider = {getOption: vi.fn(), search: vi.fn()}
        mockCreateTeamsProjectsProvider.mockReturnValue(provider)

        const result = useTeamsProjectsProvider("workspace-connection")

        expect(mockCreateTeamsProjectsProvider).toHaveBeenCalledWith({
            requestUsing: "workspace-connection",
        })
        expect(result).toBe(provider)
    })

    it("passes user-connection when specified", () => {
        const provider = {getOption: vi.fn(), search: vi.fn()}
        mockCreateTeamsProjectsProvider.mockReturnValue(provider)

        useTeamsProjectsProvider("user-connection")

        expect(mockCreateTeamsProjectsProvider).toHaveBeenCalledWith({
            requestUsing: "user-connection",
        })
    })
})
