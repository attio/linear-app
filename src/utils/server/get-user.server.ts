import type {PostToLinearOptions} from "../../linear"
import {linearApi} from "../../linear"

export default async function getUser(id: string, options: PostToLinearOptions) {
    return linearApi(options).user.get(id)
}
