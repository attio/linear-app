import type {PostToLinearOptions} from "../../linear"
import {linearApi} from "../../linear"

export default async function getTeam(id: string, options: PostToLinearOptions) {
    return linearApi(options).team.get(id)
}
