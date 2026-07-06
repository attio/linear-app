import {useAsyncCache} from "attio/client"
import {beforeEach, describe, expect, it, vi} from "vitest"
import {mockLinearIssueLabel} from "../test/linear-mocks"
import {useIssueLabelsProvider} from "./use-issue-labels-provider"

vi.mock("attio/client", () => ({useAsyncCache: vi.fn()}))
vi.mock("react", () => ({
    useMemo: (fn: () => unknown) => fn(),
    useCallback: (fn: unknown) => fn,
}))
vi.mock("../server/get-labels.server", () => ({default: vi.fn()}))

const mockUseAsyncCache = vi.mocked(useAsyncCache)
const label = mockLinearIssueLabel()

describe(useIssueLabelsProvider, () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it("calls useAsyncCache with label fetcher and requestUsing", () => {
        mockUseAsyncCache.mockReturnValue({values: {labels: []}, invalidate: vi.fn()})

        useIssueLabelsProvider("workspace-connection")

        expect(mockUseAsyncCache).toHaveBeenCalledWith({
            labels: [expect.any(Function), "workspace-connection"],
        })
    })

    it("returns undefined on getOption for empty value", async () => {
        mockUseAsyncCache.mockReturnValue({values: {labels: [label]}, invalidate: vi.fn()})

        const provider = useIssueLabelsProvider("workspace-connection")
        expect(await provider.getOption("")).toBeUndefined()
    })

    it("returns label and color on getOption", async () => {
        mockUseAsyncCache.mockReturnValue({values: {labels: [label]}, invalidate: vi.fn()})

        const provider = useIssueLabelsProvider("workspace-connection")
        const option = await provider.getOption(label.id)

        expect(option).toEqual({label: label.name, color: label.color})
    })

    it("returns undefined for unknown id on getOption", async () => {
        mockUseAsyncCache.mockReturnValue({values: {labels: []}, invalidate: vi.fn()})

        const provider = useIssueLabelsProvider("workspace-connection")
        expect(await provider.getOption("unknown")).toBeUndefined()
    })

    it("returns all labels on empty search", async () => {
        mockUseAsyncCache.mockReturnValue({values: {labels: [label]}, invalidate: vi.fn()})

        const provider = useIssueLabelsProvider("workspace-connection")
        const results = await provider.search("")

        expect(results).toEqual([{label: label.name, value: label.id, color: label.color}])
    })

    it("filters labels by name on non-empty search", async () => {
        const labels = [
            mockLinearIssueLabel({id: "l-1", name: "Bug"}),
            mockLinearIssueLabel({id: "l-2", name: "Feature"}),
        ]
        mockUseAsyncCache.mockReturnValue({values: {labels}, invalidate: vi.fn()})

        const provider = useIssueLabelsProvider("workspace-connection")
        const results = await provider.search("bug")

        expect(results).toHaveLength(1)
        expect(results[0]).toMatchObject({label: "Bug", value: "l-1"})
    })

    it("passes user-connection when specified", () => {
        mockUseAsyncCache.mockReturnValue({values: {labels: []}, invalidate: vi.fn()})

        useIssueLabelsProvider("user-connection")

        expect(mockUseAsyncCache).toHaveBeenCalledWith({
            labels: [expect.any(Function), "user-connection"],
        })
    })
})
