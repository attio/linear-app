import {isComplete} from "@attio/fetchable"
import type {DecoratedComboboxOptionsProvider} from "attio/client"
import {useAsyncCache} from "attio/client"
import {matchSorter} from "match-sorter"
import {useCallback, useMemo} from "react"
import type {LinearWorkflowState, PostToLinearOptions} from "../../linear"
import getWorkflowStates from "../server/get-workflow-states.server"

async function fetchWorkflowStates(
    requestUsing: PostToLinearOptions["requestUsing"]
): Promise<LinearWorkflowState[]> {
    const result = await getWorkflowStates({requestUsing})
    if (!isComplete(result)) throw new Error(result.error.errorMessage)
    return result.value
}

export function useWorkflowStatesProvider(
    requestUsing: PostToLinearOptions["requestUsing"]
): DecoratedComboboxOptionsProvider {
    const {values} = useAsyncCache({states: [fetchWorkflowStates, requestUsing]})

    const getOption = useCallback(
        async (value: string) => {
            if (!value) return undefined
            const state = values.states.find((s) => s.id === value)
            return state ? {label: state.name, color: state.color} : undefined
        },
        [values.states]
    )

    const search = useCallback(
        async (query: string) => {
            const filtered =
                query.length === 0
                    ? values.states
                    : matchSorter(values.states, query, {keys: ["name"]})
            return filtered.map((s) => ({label: s.name, value: s.id, color: s.color}))
        },
        [values.states]
    )

    return useMemo(() => ({getOption, search}), [getOption, search])
}
