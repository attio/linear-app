import type {ComboboxOptionsProvider} from "attio/client"
import {matchSorter} from "match-sorter"
import getPriorities from "../../linear/priorities/get-priorities.server"
import type {LinearPriority} from "../../linear/priorities/schema"

// These PROBABLY won't change very often. If they do, the user will need to refresh the page to see the new ones.
let prioritiesCache: LinearPriority[] | undefined

export const prioritiesProvider: ComboboxOptionsProvider = {
    async getOption(value) {
        if (!value) {
            return undefined
        }

        if (!prioritiesCache) {
            prioritiesCache = await getPriorities()
        }
        const priority = prioritiesCache.find((priority) => priority.priority === Number(value))
        return priority ? {label: priority.label} : undefined
    },

    async search(query) {
        if (!prioritiesCache) {
            prioritiesCache = await getPriorities()
        }
        if (query.length === 0) {
            return toOptions(prioritiesCache)
        }

        return toOptions(matchSorter(prioritiesCache, query, {keys: ["label"]}))
    },
}

function toOptions(priorities: LinearPriority[]) {
    return priorities.map((priority) => ({
        label: priority.label,
        value: priority.priority.toString(),
    }))
}
