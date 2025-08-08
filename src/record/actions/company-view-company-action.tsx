import type {RecordAction} from "attio/client"

import {viewCompanyInLinear} from "../../utils/view-company-in-linear"

export const recordAction: RecordAction = {
    id: "company-view-company-action",
    onTrigger: async ({recordId}) => {
        await viewCompanyInLinear(recordId)
    },
    label: "View company in Linear",
    objects: ["companies"],
}
