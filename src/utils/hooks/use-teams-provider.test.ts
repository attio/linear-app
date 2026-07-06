import {beforeEach, describe, expect, it, vi} from "vitest"
import {createTeamsProvider} from "../providers/teams-options-provider"
import {useTeamsProvider} from "./use-teams-provider"

vi.mock("react", () => ({useMemo: (fn: () => unknown) => fn()}))
vi.mock("../providers/teams-options-provider", () => ({
    createTeamsProvider: vi.fn(),
}))

const mockCreateTeamsProvider = vi.mocked(createTeamsProvider)

describe(useTeamsProvider, () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it("returns a decorated provider from createTeamsProvider", () => {
        const provider = {getOption: vi.fn(), search: vi.fn()}
        mockCreateTeamsProvider.mockReturnValue(provider)

        const result = useTeamsProvider("workspace-connection")

        expect(mockCreateTeamsProvider).toHaveBeenCalledWith({requestUsing: "workspace-connection"})
        expect(result).toBe(provider)
    })

    it("passes user-connection when specified", () => {
        const provider = {getOption: vi.fn(), search: vi.fn()}
        mockCreateTeamsProvider.mockReturnValue(provider)

        useTeamsProvider("user-connection")

        expect(mockCreateTeamsProvider).toHaveBeenCalledWith({requestUsing: "user-connection"})
    })
})
