import type {DecoratedComboboxOptionsProvider} from "attio/client"
import {useMemo} from "react"
import type {PostToLinearOptions} from "../../linear"
import {createProjectsIssuesProvider} from "../providers/projects-issues-options-provider"

export function useProjectsIssuesProvider(
    requestUsing: PostToLinearOptions["requestUsing"],
    {showCreateNewOption = true}: {showCreateNewOption?: boolean} = {}
): DecoratedComboboxOptionsProvider {
    return useMemo(
        () => createProjectsIssuesProvider({requestUsing, showCreateNewOption}),
        [requestUsing, showCreateNewOption]
    )
}
