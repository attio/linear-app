import {getUserConnection} from "attio/server"

// biome-ignore lint/suspicious/noExplicitAny: We use zod everywhere to validate the request
export async function postToLinear(request: unknown): Promise<any> {
    const response = await fetch("https://api.linear.app/graphql", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getUserConnection().value}`,
        },
        body: JSON.stringify(request),
    })

    if (!response.ok) {
        throw new Error(await response.text())
    }

    return await response.json()
}
