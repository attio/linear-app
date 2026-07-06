import {useAsyncCache} from "attio/client"
import {beforeEach, describe, expect, it, vi} from "vitest"
import {mockLinearWorkflowState} from "../test/linear-mocks"
import {useWorkflowStatesProvider} from "./use-workflow-states-provider"

vi.mock("attio/client", () => ({useAsyncCache: vi.fn()}))
vi.mock("react", () => ({
    useMemo: (fn: () => unknown) => fn(),
    useCallback: (fn: unknown) => fn,
}))
vi.mock("../server/get-workflow-states.server", () => ({default: vi.fn()}))

const mockUseAsyncCache = vi.mocked(useAsyncCache)
const state = mockLinearWorkflowState()

describe(useWorkflowStatesProvider, () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it("calls useAsyncCache with state fetcher and requestUsing", () => {
        mockUseAsyncCache.mockReturnValue({values: {states: []}, invalidate: vi.fn()})

        useWorkflowStatesProvider("workspace-connection")

        expect(mockUseAsyncCache).toHaveBeenCalledWith({
            states: [expect.any(Function), "workspace-connection"],
        })
    })

    it("passes user-connection when specified", () => {
        mockUseAsyncCache.mockReturnValue({values: {states: []}, invalidate: vi.fn()})

        useWorkflowStatesProvider("user-connection")

        expect(mockUseAsyncCache).toHaveBeenCalledWith({
            states: [expect.any(Function), "user-connection"],
        })
    })

    it("returns undefined on getOption for empty value", async () => {
        mockUseAsyncCache.mockReturnValue({values: {states: [state]}, invalidate: vi.fn()})

        const provider = useWorkflowStatesProvider("workspace-connection")
        expect(await provider.getOption("")).toBeUndefined()
    })

    it("returns label and color on getOption", async () => {
        mockUseAsyncCache.mockReturnValue({values: {states: [state]}, invalidate: vi.fn()})

        const provider = useWorkflowStatesProvider("workspace-connection")
        const option = await provider.getOption(state.id)

        expect(option).toEqual({label: state.name, color: state.color})
    })

    it("returns undefined for unknown id on getOption", async () => {
        mockUseAsyncCache.mockReturnValue({values: {states: []}, invalidate: vi.fn()})

        const provider = useWorkflowStatesProvider("workspace-connection")
        expect(await provider.getOption("unknown")).toBeUndefined()
    })

    it("returns all states on empty search", async () => {
        mockUseAsyncCache.mockReturnValue({values: {states: [state]}, invalidate: vi.fn()})

        const provider = useWorkflowStatesProvider("workspace-connection")
        const results = await provider.search("")

        expect(results).toEqual([{label: state.name, value: state.id, color: state.color}])
    })

    it("filters states by name on non-empty search", async () => {
        const states = [
            mockLinearWorkflowState({id: "s-1", name: "In Progress"}),
            mockLinearWorkflowState({id: "s-2", name: "Done"}),
        ]
        mockUseAsyncCache.mockReturnValue({values: {states}, invalidate: vi.fn()})

        const provider = useWorkflowStatesProvider("workspace-connection")
        const results = await provider.search("done")

        expect(results).toHaveLength(1)
        expect(results[0]).toMatchObject({label: "Done", value: "s-2"})
    })
})
