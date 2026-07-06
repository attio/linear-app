import type {PostToLinearOptions} from "../../linear"
import {linearApi} from "../../linear"

export default async function getTeams(options: PostToLinearOptions) {
    return linearApi(options).team.list()
}
