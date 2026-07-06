import type {PostToLinearOptions} from "../../linear"
import {linearApi} from "../../linear"

export default async function getIssue(id: string, options: PostToLinearOptions) {
    return linearApi(options).issue.get(id)
}
