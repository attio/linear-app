import type {PostToLinearOptions} from "../../linear"
import {linearApi} from "../../linear"

export default async function searchUsers({
    teamId,
    searchQuery,
    options,
}: {
    teamId: string
    searchQuery: string
    options: PostToLinearOptions
}) {
    return linearApi(options).user.search(teamId, searchQuery)
}
