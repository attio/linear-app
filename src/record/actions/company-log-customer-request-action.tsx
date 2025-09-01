import type {App} from "attio/client"
import {showDialog} from "attio/client"
import {LogCustomerRequestDialog} from "../../components/log-customer-request-dialog"
import ensureConnection from "../../utils/ensure-connection.server"
import {ensureCustomerRequestsEnabled} from "../../utils/ensure-customer-requests-enabled"

export const companyLogCustomerRequestAction: App.Record.Action = {
    id: "company-log-customer-request-action",
    onTrigger: async ({recordId}) => {
        await ensureConnection()
        if (await ensureCustomerRequestsEnabled()) {
            await showDialog({
                title: "Log Customer Request",
                Dialog: ({hideDialog}: {hideDialog: () => void}) => (
                    <LogCustomerRequestDialog companyRecordId={recordId} onDone={hideDialog} />
                ),
            })
        }
    },
    label: "Log customer request",
    objects: ["companies"],
}
