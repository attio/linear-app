import {complete} from "@attio/fetchable"
import {beforeEach, describe, expect, it, vi} from "vitest"
import getTeam from "../server/get-team.server"
import getTeams from "../server/get-teams.server"
import searchTeams from "../server/search-teams.server"
import {mockLinearTeam} from "../test/linear-mocks"
import {createTeamsProvider} from "./teams-options-provider"

vi.mock("../server/get-team.server", () => ({default: vi.fn()}))
vi.mock("../server/get-teams.server", () => ({default: vi.fn()}))
vi.mock("../server/search-teams.server", () => ({default: vi.fn()}))

const mockGetTeam = vi.mocked(getTeam)
const mockGetTeams = vi.mocked(getTeams)
const mockSearchTeams = vi.mocked(searchTeams)

const team = mockLinearTeam()

describe(createTeamsProvider, () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it("returns teams when query is empty", async () => {
        mockGetTeams.mockResolvedValue(complete([team]))

        const results = await createTeamsProvider({requestUsing: "user-connection"}).search("")

        expect(results).toEqual([{label: team.name, value: team.id, color: team.color}])
    })

    it("uses search endpoint when query is provided", async () => {
        mockSearchTeams.mockResolvedValue(complete([team]))

        await createTeamsProvider({requestUsing: "user-connection"}).search("eng")

        expect(mockSearchTeams).toHaveBeenCalledWith("eng", {requestUsing: "user-connection"})
        expect(mockGetTeams).not.toHaveBeenCalled()
    })

    it("threads the connection option through every fetch", async () => {
        mockGetTeams.mockResolvedValue(complete([]))
        mockSearchTeams.mockResolvedValue(complete([]))

        const provider = createTeamsProvider({requestUsing: "workspace-connection"})
        await provider.search("")
        expect(mockGetTeams).toHaveBeenCalledWith({requestUsing: "workspace-connection"})

        await provider.search("eng")
        expect(mockSearchTeams).toHaveBeenCalledWith("eng", {requestUsing: "workspace-connection"})
    })

    it("returns undefined on getOption for blank value", async () => {
        const option = await createTeamsProvider({requestUsing: "user-connection"}).getOption(" ")
        expect(option).toBeUndefined()
        expect(mockGetTeam).not.toHaveBeenCalled()
    })

    it("resolves a team option", async () => {
        mockGetTeam.mockResolvedValue(complete(team))

        const option = await createTeamsProvider({requestUsing: "user-connection"}).getOption(
            team.id
        )

        expect(option).toEqual({label: team.name, color: team.color})
        expect(mockGetTeam).toHaveBeenCalledWith(team.id, {requestUsing: "user-connection"})
    })

    it("returns undefined when team is not found", async () => {
        mockGetTeam.mockResolvedValue(complete(null))

        const option = await createTeamsProvider({requestUsing: "user-connection"}).getOption(
            "missing"
        )

        expect(option).toBeUndefined()
    })
})
