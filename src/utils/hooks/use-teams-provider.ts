import type {DecoratedComboboxOptionsProvider} from "attio/client"
import {useMemo} from "react"
import type {PostToLinearOptions} from "../../linear"
import {createTeamsProvider} from "../providers/teams-options-provider"

export function useTeamsProvider(
    requestUsing: PostToLinearOptions["requestUsing"]
): DecoratedComboboxOptionsProvider {
    return useMemo(() => createTeamsProvider({requestUsing}), [requestUsing])
}
