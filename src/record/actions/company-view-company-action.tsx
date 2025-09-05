import type {App} from "attio/client"
import {showToast} from "attio/client"
import {viewCompanyInLinear} from "../../utils/view-company-in-linear"

export const companyViewCompanyAction: App.Record.Action = {
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
