import type {DecoratedComboboxOptionsProvider} from "attio/client"
import getUser from "../../linear/users/get-user.server"
import getUsers from "../../linear/users/get-users.server"
import type {LinearUser} from "../../linear/users/schema"
import searchUsers from "../../linear/users/search-users.server"

// Cache for memoizing the users provider
let cachedProvider: {
    teamId: string
    provider: DecoratedComboboxOptionsProvider
} | null = null

export function createUsersProvider(teamId: string): DecoratedComboboxOptionsProvider {
    // Return cached provider if it's for the same teamId
    if (cachedProvider && cachedProvider.teamId === teamId) {
        return cachedProvider.provider
    }

    // Create new provider
    const provider: DecoratedComboboxOptionsProvider = {
        async getOption(value) {
            if (!value) {
                return undefined
            }

            const user = await getUser(value)
            return user
                ? user.avatarUrl
                    ? {label: user.name, avatarUrl: user.avatarUrl}
                    : {label: user.name, icon: "User"}
                : undefined
        },

        async search(query) {
            if (query.length === 0) {
                const users = await getUsers(teamId)
                return toOptions(users)
            }
            const users = await searchUsers(teamId, query)
            return toOptions(users)
        },
    }

    // Cache the new provider
    cachedProvider = {teamId, provider}

    return provider
}

function toOptions(users: LinearUser[]) {
    return users.map((user) =>
        user.avatarUrl
            ? {
                  label: user.name,
                  value: user.id,
                  avatarUrl: user.avatarUrl,
              }
            : {
                  label: user.name,
                  value: user.id,
                  icon: "User" as const,
              }
    )
}
