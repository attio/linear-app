import {complete} from "@attio/fetchable"
import {useAsyncCache} from "attio/client"
import {beforeEach, describe, expect, it, vi} from "vitest"
import getUser from "../server/get-user.server"
import searchUsers from "../server/search-users.server"
import {mockLinearUser} from "../test/linear-mocks"
import {useUsersProvider} from "./use-users-provider"

vi.mock("attio/client", () => ({useAsyncCache: vi.fn()}))
vi.mock("react", () => ({
    useMemo: (fn: () => unknown) => fn(),
    useCallback: (fn: unknown) => fn,
}))
vi.mock("../server/get-users.server", () => ({default: vi.fn()}))
vi.mock("../server/get-user.server", () => ({default: vi.fn()}))
vi.mock("../server/search-users.server", () => ({default: vi.fn()}))

const mockUseAsyncCache = vi.mocked(useAsyncCache)
const mockGetUser = vi.mocked(getUser)
const mockSearchUsers = vi.mocked(searchUsers)
const user = mockLinearUser({avatarUrl: "https://example.com/avatar.png"})

describe(useUsersProvider, () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it("calls useAsyncCache with user fetcher, teamId, and requestUsing", () => {
        mockUseAsyncCache.mockReturnValue({values: {users: []}, invalidate: vi.fn()})

        useUsersProvider("team-1", "workspace-connection")

        expect(mockUseAsyncCache).toHaveBeenCalledWith({
            users: [expect.any(Function), "team-1", "workspace-connection"],
        })
    })

    it("passes different teamId to useAsyncCache", () => {
        mockUseAsyncCache.mockReturnValue({values: {users: []}, invalidate: vi.fn()})

        useUsersProvider("team-2", "user-connection")

        expect(mockUseAsyncCache).toHaveBeenCalledWith({
            users: [expect.any(Function), "team-2", "user-connection"],
        })
    })

    it("returns undefined on getOption for empty value", async () => {
        mockUseAsyncCache.mockReturnValue({values: {users: [user]}, invalidate: vi.fn()})

        const provider = useUsersProvider("team-1", "workspace-connection")
        expect(await provider.getOption("")).toBeUndefined()
    })

    it("returns label and avatarUrl on getOption from cache", async () => {
        mockUseAsyncCache.mockReturnValue({values: {users: [user]}, invalidate: vi.fn()})

        const provider = useUsersProvider("team-1", "workspace-connection")
        const option = await provider.getOption(user.id)

        expect(option).toEqual({label: user.name, avatarUrl: user.avatarUrl})
        expect(mockGetUser).not.toHaveBeenCalled()
    })

    it("falls back to getUser when user is not in cache", async () => {
        mockUseAsyncCache.mockReturnValue({values: {users: []}, invalidate: vi.fn()})
        mockGetUser.mockResolvedValue(complete(user))

        const provider = useUsersProvider("team-1", "workspace-connection")
        const option = await provider.getOption(user.id)

        expect(option).toEqual({label: user.name, avatarUrl: user.avatarUrl})
        expect(mockGetUser).toHaveBeenCalledWith(user.id, {requestUsing: "workspace-connection"})
    })

    it("returns undefined when user is not found on getOption", async () => {
        mockUseAsyncCache.mockReturnValue({values: {users: []}, invalidate: vi.fn()})
        mockGetUser.mockResolvedValue(complete(null))

        const provider = useUsersProvider("team-1", "workspace-connection")
        expect(await provider.getOption("missing")).toBeUndefined()
    })

    it("returns cached users on empty search", async () => {
        mockUseAsyncCache.mockReturnValue({values: {users: [user]}, invalidate: vi.fn()})

        const provider = useUsersProvider("team-1", "workspace-connection")
        const results = await provider.search("")

        expect(results[0]).toMatchObject({
            label: user.name,
            value: user.id,
            avatarUrl: user.avatarUrl,
        })
        expect(mockSearchUsers).not.toHaveBeenCalled()
    })

    it("calls searchUsers for non-empty search", async () => {
        mockUseAsyncCache.mockReturnValue({values: {users: [user]}, invalidate: vi.fn()})
        mockSearchUsers.mockResolvedValue(complete([user]))

        const provider = useUsersProvider("team-1", "workspace-connection")
        const results = await provider.search("alice")

        expect(mockSearchUsers).toHaveBeenCalledWith({
            teamId: "team-1",
            searchQuery: "alice",
            options: {requestUsing: "workspace-connection"},
        })
        expect(results).toHaveLength(1)
        expect(results[0]).toMatchObject({label: user.name, value: user.id})
    })

    it("returns empty results when teamId is missing", async () => {
        mockUseAsyncCache.mockReturnValue({values: {users: [user]}, invalidate: vi.fn()})

        const provider = useUsersProvider("", "workspace-connection")
        expect(await provider.search("alice")).toEqual([])
    })
})
