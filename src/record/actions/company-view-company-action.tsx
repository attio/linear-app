import {showToast, type RecordAction} from "attio/client"

import {viewCompanyInLinear} from "../../utils/view-company-in-linear"

export const recordAction: RecordAction = {
    id: "company-view-company-action",
    onTrigger: async ({recordId}) => {
        await viewCompanyInLinear(recordId).catch((error) => {
            showToast({
                variant: "error",
                title: "Error viewing company in Linear",
                text: error.message,
            })
        })
    },
    label: "View company in Linear",
    objects: ["companies"],
}
