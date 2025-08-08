import type {DecoratedComboboxOptionsProvider} from "attio/client"
import {matchSorter} from "match-sorter"
import getWorkflowStates from "../../linear/workflow-states/get-workflow-states.server"
import type {LinearWorkflowState} from "../../linear/workflow-states/schema"

// These PROBABLY won't change very often. If they do, the user will need to refresh the page to see the new ones.
let workflowStatesCache: LinearWorkflowState[] | undefined

export const workflowStatesProvider: DecoratedComboboxOptionsProvider = {
    async getOption(value) {
        if (!value) {
            return undefined
        }

        if (!workflowStatesCache) {
            workflowStatesCache = await getWorkflowStates()
        }
        const workflowState = workflowStatesCache.find(
            (workflowState) => workflowState.id === value
        )
        return workflowState ? {label: workflowState.name, color: workflowState.color} : undefined
    },

    async search(query) {
        if (!workflowStatesCache) {
            workflowStatesCache = await getWorkflowStates()
        }
        if (query.length === 0) {
            return toOptions(workflowStatesCache)
        }

        return toOptions(matchSorter(workflowStatesCache, query, {keys: ["name"]}))
    },
}

function toOptions(workflowStates: LinearWorkflowState[]) {
    return workflowStates.map((workflowState) => ({
        label: workflowState.name,
        value: workflowState.id,
        color: workflowState.color,
    }))
}
