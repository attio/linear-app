import type {PostToLinearOptions} from "../../linear"
import {linearApi} from "../../linear"

export default async function searchTeams(searchQuery: string, options: PostToLinearOptions) {
    return linearApi(options).team.search(searchQuery)
}
