import type {PostToLinearOptions} from "../../linear"
import {linearApi} from "../../linear"

export default async function getProjects(options: PostToLinearOptions) {
    return linearApi(options).project.list()
}
