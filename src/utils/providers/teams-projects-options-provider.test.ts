import {complete} from "@attio/fetchable"
import {beforeEach, describe, expect, it, vi} from "vitest"
import getProject from "../server/get-project.server"
import getProjects from "../server/get-projects.server"
import getTeam from "../server/get-team.server"
import getTeams from "../server/get-teams.server"
import searchProjects from "../server/search-projects.server"
import searchTeams from "../server/search-teams.server"
import {mockLinearProject, mockLinearTeam} from "../test/linear-mocks"
import {createTeamsProjectsProvider} from "./teams-projects-options-provider"

vi.mock("../server/get-team.server", () => ({default: vi.fn()}))
vi.mock("../server/get-teams.server", () => ({default: vi.fn()}))
vi.mock("../server/search-teams.server", () => ({default: vi.fn()}))
vi.mock("../server/get-project.server", () => ({default: vi.fn()}))
vi.mock("../server/get-projects.server", () => ({default: vi.fn()}))
vi.mock("../server/search-projects.server", () => ({default: vi.fn()}))

const mockGetTeam = vi.mocked(getTeam)
const mockGetTeams = vi.mocked(getTeams)
const mockSearchTeams = vi.mocked(searchTeams)
const mockGetProject = vi.mocked(getProject)
const mockGetProjects = vi.mocked(getProjects)
const mockSearchProjects = vi.mocked(searchProjects)

const team = mockLinearTeam()
const project = mockLinearProject()

describe(createTeamsProjectsProvider, () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it("returns teams and projects when query is empty", async () => {
        mockGetTeams.mockResolvedValue(complete([team]))
        mockGetProjects.mockResolvedValue(complete([project]))

        const results = await createTeamsProjectsProvider({requestUsing: "user-connection"}).search(
            ""
        )

        expect(results).toEqual([
            {label: team.name, value: `team:${team.id}`, categoryLabel: "Teams", color: team.color},
            {
                label: project.name,
                value: `project:${project.id}`,
                categoryLabel: "Projects",
                color: project.color,
            },
        ])
    })

    it("uses search endpoints when query is provided", async () => {
        mockSearchTeams.mockResolvedValue(complete([team]))
        mockSearchProjects.mockResolvedValue(complete([project]))

        await createTeamsProjectsProvider({requestUsing: "user-connection"}).search("eng")

        expect(mockSearchTeams).toHaveBeenCalledWith("eng", {requestUsing: "user-connection"})
        expect(mockSearchProjects).toHaveBeenCalledWith("eng", {requestUsing: "user-connection"})
        expect(mockGetTeams).not.toHaveBeenCalled()
        expect(mockGetProjects).not.toHaveBeenCalled()
    })

    it("threads the connection option through every fetch", async () => {
        mockGetTeams.mockResolvedValue(complete([]))
        mockGetProjects.mockResolvedValue(complete([]))

        await createTeamsProjectsProvider({requestUsing: "workspace-connection"}).search("")

        expect(mockGetTeams).toHaveBeenCalledWith({requestUsing: "workspace-connection"})
        expect(mockGetProjects).toHaveBeenCalledWith({requestUsing: "workspace-connection"})
    })

    it("resolves a team option", async () => {
        mockGetTeam.mockResolvedValue(complete(team))

        const option = await createTeamsProjectsProvider({
            requestUsing: "user-connection",
        }).getOption(`team:${team.id}`)

        expect(option).toEqual({label: team.name, categoryLabel: "Teams", color: team.color})
        expect(mockGetTeam).toHaveBeenCalledWith(team.id, {requestUsing: "user-connection"})
    })

    it("resolves a project option", async () => {
        mockGetProject.mockResolvedValue(complete(project))

        const option = await createTeamsProjectsProvider({
            requestUsing: "user-connection",
        }).getOption(`project:${project.id}`)

        expect(option).toEqual({
            label: project.name,
            categoryLabel: "Projects",
            color: project.color,
        })
        expect(mockGetProject).toHaveBeenCalledWith(project.id, {requestUsing: "user-connection"})
    })

    it("returns undefined for unknown type", async () => {
        const option = await createTeamsProjectsProvider({
            requestUsing: "user-connection",
        }).getOption("unknown:123")
        expect(option).toBeUndefined()
    })
})
