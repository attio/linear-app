import type {PostToLinearOptions} from "../../linear"
import {linearApi} from "../../linear"

export default async function getLabels(options: PostToLinearOptions) {
    return linearApi(options).label.list()
}
