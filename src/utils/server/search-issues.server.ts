import type {PostToLinearOptions} from "../../linear"
import {linearApi} from "../../linear"

export default async function searchIssues(searchQuery: string, options: PostToLinearOptions) {
    return linearApi(options).issue.search(searchQuery)
}
