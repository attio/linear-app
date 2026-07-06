import type {DecoratedComboboxOptionsProvider} from "attio/client"
import {useMemo} from "react"
import type {PostToLinearOptions} from "../../linear"
import {createTeamsProjectsProvider} from "../providers/teams-projects-options-provider"

export function useTeamsProjectsProvider(
    requestUsing: PostToLinearOptions["requestUsing"]
): DecoratedComboboxOptionsProvider {
    return useMemo(() => createTeamsProjectsProvider({requestUsing}), [requestUsing])
}
