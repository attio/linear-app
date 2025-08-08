import {postToLinear} from "../post-to-linear"
import {LinearOrganization, linearOrganizationFragment, linearOrganizationSchema} from "./schema"

const query = `query Organization {
    organization {
        ${linearOrganizationFragment}
    }
}`

export default async function getOrganization(): Promise<LinearOrganization> {
    const result = await postToLinear({
        query,
    })

    return linearOrganizationSchema.parse(result.data.organization)
}
