import {linearApi} from "../../linear"

export default async function getOrganization() {
    return linearApi({requestUsing: "user-connection"}).organization.get()
}
