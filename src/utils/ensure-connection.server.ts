import {getUserConnection} from "attio/server"

export default function ensureConnection() {
    return Boolean(getUserConnection())
}
