import {linearApi} from "../../linear"

export default async function getPriorities() {
    return linearApi({requestUsing: "workspace-connection"}).priority.list()
}
