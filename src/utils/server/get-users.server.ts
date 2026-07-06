import type {PostToLinearOptions} from "../../linear"
import {linearApi} from "../../linear"

export default async function getUsers(teamId: string, options: PostToLinearOptions) {
    return linearApi(options).user.list(teamId)
}
