import {getUserConnection} from "attio/server"

export default async function ensureConnection() {
    return Boolean(getUserConnection())
}
