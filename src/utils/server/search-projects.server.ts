import type {PostToLinearOptions} from "../../linear"
import {linearApi} from "../../linear"

export default async function searchProjects(searchQuery: string, options: PostToLinearOptions) {
    return linearApi(options).project.search(searchQuery)
}
