import type {PostToLinearOptions} from "../../linear"
import {linearApi} from "../../linear"

export default async function getProject(id: string, options: PostToLinearOptions) {
    return linearApi(options).project.get(id)
}
