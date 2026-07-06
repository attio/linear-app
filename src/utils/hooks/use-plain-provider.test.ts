import type {DecoratedComboboxOptionsProvider} from "attio/client"
import {describe, expect, it, vi} from "vitest"
import {usePlainProvider} from "./use-plain-provider"

vi.mock("react", () => ({
    useMemo: (fn: () => unknown) => fn(),
    useCallback: (fn: unknown) => fn,
}))

function mockDecoratedProvider(
    implementation: Partial<DecoratedComboboxOptionsProvider>
): DecoratedComboboxOptionsProvider {
    return {
        getOption: implementation.getOption ?? vi.fn(),
        search: implementation.search ?? vi.fn(),
    }
}

describe(usePlainProvider, () => {
    it("returns only the label on getOption", async () => {
        const provider = usePlainProvider(
            mockDecoratedProvider({
                getOption: vi.fn().mockResolvedValue({
                    label: "Engineering",
                    color: "#26b5ce",
                    icon: "Workspace",
                }),
            })
        )

        expect(await provider.getOption("team-1")).toEqual({label: "Engineering"})
    })

    it("returns undefined on getOption when the decorated provider does", async () => {
        const provider = usePlainProvider(
            mockDecoratedProvider({
                getOption: vi.fn().mockResolvedValue(undefined),
            })
        )

        expect(await provider.getOption("missing")).toBeUndefined()
    })

    it("strips decoration from search results", async () => {
        const provider = usePlainProvider(
            mockDecoratedProvider({
                search: vi
                    .fn()
                    .mockResolvedValue([{label: "Engineering", value: "team-1", color: "#26b5ce"}]),
            })
        )

        const results = await provider.search("eng")

        expect(results).toEqual([{label: "Engineering", value: "team-1", description: undefined}])
    })

    it("preserves categoryLabel and uses it as description when description is absent", async () => {
        const provider = usePlainProvider(
            mockDecoratedProvider({
                search: vi.fn().mockResolvedValue([
                    {
                        label: "Project One",
                        value: "project:project-1",
                        categoryLabel: "Projects",
                        icon: "Workspace",
                    },
                ]),
            })
        )

        const results = await provider.search("")

        expect(results).toEqual([
            {
                label: "Project One",
                value: "project:project-1",
                categoryLabel: "Projects",
                description: "Projects",
            },
        ])
    })

    it("preserves an explicit description over categoryLabel", async () => {
        const provider = usePlainProvider(
            mockDecoratedProvider({
                search: vi.fn().mockResolvedValue([
                    {
                        label: "Fix the dropdown",
                        value: "issue:issue-1",
                        categoryLabel: "Issues",
                        description: "ECO-4401",
                        icon: "Note",
                    },
                ]),
            })
        )

        const results = await provider.search("dropdown")

        expect(results).toEqual([
            {
                label: "Fix the dropdown",
                value: "issue:issue-1",
                categoryLabel: "Issues",
                description: "ECO-4401",
            },
        ])
    })
})
