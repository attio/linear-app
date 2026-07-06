import {complete, errored} from "@attio/fetchable"
import {beforeEach, describe, expect, it, vi} from "vitest"
import {linearApi} from "../../linear"
import {LinearGqlClientErrorCode} from "../../linear/client/linear-gql-client"
import {resolveTeamId} from "./resolve-team-id.server"

vi.mock("../../linear", () => ({linearApi: vi.fn()}))

const mockLinearApi = vi.mocked(linearApi)

describe("resolveTeamId", () => {
    const getTeamId = vi.fn()

    beforeEach(() => {
        vi.clearAllMocks()
        mockLinearApi.mockReturnValue({
            project: {getTeamId},
        } as unknown as ReturnType<typeof linearApi>)
    })

    it("returns the scope id directly when scope type is team", async () => {
        const result = await resolveTeamId("team", "team-123")

        expect(result).toEqual({teamId: "team-123"})
        expect(mockLinearApi).not.toHaveBeenCalled()
        expect(getTeamId).not.toHaveBeenCalled()
    })

    it("returns the project's team id for project scope", async () => {
        getTeamId.mockResolvedValue(complete("team-456"))

        const result = await resolveTeamId("project", "project-1")

        expect(mockLinearApi).toHaveBeenCalledWith({requestUsing: "workspace-connection"})
        expect(getTeamId).toHaveBeenCalledWith("project-1")
        expect(result).toEqual({teamId: "team-456"})
    })

    it("returns a friendly error when the project has no associated team", async () => {
        getTeamId.mockResolvedValue(complete(null))

        const result = await resolveTeamId("project", "project-no-team")

        expect(result).toEqual({error: "Project project-no-team has no associated team"})
    })

    it("returns a friendly error when the Linear request fails", async () => {
        getTeamId.mockResolvedValue(
            errored({code: LinearGqlClientErrorCode.HttpError, errorMessage: "boom"})
        )

        const result = await resolveTeamId("project", "project-1")

        expect(result).toEqual({error: "Failed to fetch project project-1 from Linear"})
    })

    it("returns an error for unknown scope types", async () => {
        const result = await resolveTeamId("workspace", "scope-1")

        expect(result).toEqual({
            error: 'Unknown scope type "workspace" — expected "team" or "project"',
        })
        expect(mockLinearApi).not.toHaveBeenCalled()
    })
})
