import {useAsyncCache} from "attio/client"
import {beforeEach, describe, expect, it, vi} from "vitest"
import {usePrioritiesProvider} from "./use-priorities-provider"

vi.mock("attio/client", () => ({useAsyncCache: vi.fn()}))
vi.mock("react", () => ({
    useMemo: (fn: () => unknown) => fn(),
    useCallback: (fn: unknown) => fn,
}))
vi.mock("../server/get-priorities.server", () => ({default: vi.fn()}))

const mockUseAsyncCache = vi.mocked(useAsyncCache)

const priorities = [
    {priority: 0, label: "No priority"},
    {priority: 1, label: "Urgent"},
    {priority: 2, label: "High"},
]

describe(usePrioritiesProvider, () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it("calls useAsyncCache with getPriorities function", () => {
        mockUseAsyncCache.mockReturnValue({values: {priorities: []}, invalidate: vi.fn()})

        usePrioritiesProvider()

        expect(mockUseAsyncCache).toHaveBeenCalledWith({priorities: expect.any(Function)})
    })

    it("returns undefined on getOption for empty value", async () => {
        mockUseAsyncCache.mockReturnValue({values: {priorities}, invalidate: vi.fn()})

        const provider = usePrioritiesProvider()
        expect(await provider.getOption("")).toBeUndefined()
    })

    it("returns label on getOption", async () => {
        mockUseAsyncCache.mockReturnValue({values: {priorities}, invalidate: vi.fn()})

        const provider = usePrioritiesProvider()
        const option = await provider.getOption("1")

        expect(option).toEqual({label: "Urgent"})
    })

    it("returns undefined for unknown priority on getOption", async () => {
        mockUseAsyncCache.mockReturnValue({values: {priorities}, invalidate: vi.fn()})

        const provider = usePrioritiesProvider()
        expect(await provider.getOption("99")).toBeUndefined()
    })

    it("returns all priorities on empty search", async () => {
        mockUseAsyncCache.mockReturnValue({values: {priorities}, invalidate: vi.fn()})

        const provider = usePrioritiesProvider()
        const results = await provider.search("")

        expect(results).toEqual([
            {label: "No priority", value: "0"},
            {label: "Urgent", value: "1"},
            {label: "High", value: "2"},
        ])
    })

    it("filters priorities by label on non-empty search", async () => {
        mockUseAsyncCache.mockReturnValue({values: {priorities}, invalidate: vi.fn()})

        const provider = usePrioritiesProvider()
        const results = await provider.search("urgent")

        expect(results).toHaveLength(1)
        expect(results[0]).toMatchObject({label: "Urgent", value: "1"})
    })
})
