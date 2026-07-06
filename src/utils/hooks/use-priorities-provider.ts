import {isErrored} from "@attio/fetchable"
import type {PlainComboboxOptionsProvider} from "attio/client"
import {useAsyncCache} from "attio/client"
import {matchSorter} from "match-sorter"
import {useCallback, useMemo} from "react"
import type {LinearPriority} from "../../linear"
import getPriorities from "../server/get-priorities.server"

async function fetchPriorities(): Promise<LinearPriority[]> {
    const result = await getPriorities()
    if (isErrored(result)) throw new Error(result.error.errorMessage)
    return result.value
}

function toOptions(priorities: LinearPriority[]) {
    return priorities.map((p) => ({label: p.label, value: p.priority.toString()}))
}

export function usePrioritiesProvider(): PlainComboboxOptionsProvider {
    const {values} = useAsyncCache({priorities: fetchPriorities})

    const getOption = useCallback(
        async (value: string) => {
            if (!value) return undefined
            const priority = values.priorities.find((p) => p.priority === Number(value))
            return priority ? {label: priority.label} : undefined
        },
        [values.priorities]
    )

    const search = useCallback(
        async (query: string) => {
            const filtered =
                query.length === 0
                    ? values.priorities
                    : matchSorter(values.priorities, query, {keys: ["label"]})
            return toOptions(filtered)
        },
        [values.priorities]
    )

    return useMemo(() => ({getOption, search}), [getOption, search])
}
