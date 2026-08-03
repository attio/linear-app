import {showToast, experimental_extensions} from "attio/client"
import {viewCompanyInLinear} from "../../../utils/view-company-in-linear"

export default experimental_extensions.defineExtension({
    type: "record-action",
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
})
