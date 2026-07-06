import {isComplete} from "@attio/fetchable"
import type {DecoratedComboboxOptionsProvider} from "attio/client"
import {useAsyncCache} from "attio/client"
import {useCallback, useMemo} from "react"
import type {LinearUser, PostToLinearOptions} from "../../linear"
import getUser from "../server/get-user.server"
import getUsers from "../server/get-users.server"
import searchUsers from "../server/search-users.server"

async function fetchUsers(
    teamId: string,
    requestUsing: PostToLinearOptions["requestUsing"]
): Promise<LinearUser[]> {
    if (!teamId) return []
    const result = await getUsers(teamId, {requestUsing})
    if (!isComplete(result)) throw new Error(result.error.errorMessage)
    return result.value
}

function toUserOption(user: LinearUser) {
    return user.avatarUrl
        ? {label: user.name, value: user.id, avatarUrl: user.avatarUrl}
        : {label: user.name, value: user.id, icon: "User" as const}
}

function toUserOptionLabel(user: LinearUser) {
    return user.avatarUrl
        ? {label: user.name, avatarUrl: user.avatarUrl}
        : {label: user.name, icon: "User" as const}
}

export function useUsersProvider(
    teamId: string,
    requestUsing: PostToLinearOptions["requestUsing"]
): DecoratedComboboxOptionsProvider {
    const {values} = useAsyncCache({users: [fetchUsers, teamId, requestUsing]})

    const getOption = useCallback(
        async (value: string) => {
            if (!value) return undefined

            const cached = values.users.find((u) => u.id === value)
            if (cached) return toUserOptionLabel(cached)

            const result = await getUser(value, {requestUsing})
            if (!isComplete(result)) throw new Error(result.error.errorMessage)
            if (!result.value) return undefined
            return toUserOptionLabel(result.value)
        },
        [values.users, requestUsing]
    )

    const search = useCallback(
        async (query: string) => {
            if (!teamId) return []

            if (query.length === 0) {
                return values.users.map(toUserOption)
            }

            const result = await searchUsers({
                teamId,
                searchQuery: query,
                options: {requestUsing},
            })
            if (!isComplete(result)) throw new Error(result.error.errorMessage)
            return result.value.map(toUserOption)
        },
        [teamId, requestUsing, values.users]
    )

    return useMemo(() => ({getOption, search}), [getOption, search])
}
