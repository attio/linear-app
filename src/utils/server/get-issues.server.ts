import type {PostToLinearOptions} from "../../linear"
import {linearApi} from "../../linear"

export default async function getIssues(options: PostToLinearOptions) {
    return linearApi(options).issue.list()
}
