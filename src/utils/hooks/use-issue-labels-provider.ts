import {isComplete} from "@attio/fetchable"
import type {DecoratedComboboxOptionsProvider} from "attio/client"
import {useAsyncCache} from "attio/client"
import {matchSorter} from "match-sorter"
import {useCallback, useMemo} from "react"
import type {LinearIssueLabel, PostToLinearOptions} from "../../linear"
import getLabels from "../server/get-labels.server"

async function fetchLabels(
    requestUsing: PostToLinearOptions["requestUsing"]
): Promise<LinearIssueLabel[]> {
    const result = await getLabels({requestUsing})
    if (!isComplete(result)) throw new Error(result.error.errorMessage)
    return result.value
}

export function useIssueLabelsProvider(
    requestUsing: PostToLinearOptions["requestUsing"]
): DecoratedComboboxOptionsProvider {
    const {values} = useAsyncCache({labels: [fetchLabels, requestUsing]})

    const getOption = useCallback(
        async (value: string) => {
            if (!value) return undefined
            const label = values.labels.find((l) => l.id === value)
            return label ? {label: label.name, color: label.color} : undefined
        },
        [values.labels]
    )

    const search = useCallback(
        async (query: string) => {
            const filtered =
                query.length === 0
                    ? values.labels
                    : matchSorter(values.labels, query, {keys: ["name"]})
            return filtered.map((l) => ({label: l.name, value: l.id, color: l.color}))
        },
        [values.labels]
    )

    return useMemo(() => ({getOption, search}), [getOption, search])
}
