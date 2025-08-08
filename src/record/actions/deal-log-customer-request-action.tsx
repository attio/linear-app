import type {RecordAction} from "attio/client"
import {runQuery, showDialog, showToast} from "attio/client"
import {LogCustomerRequestDialog} from "../../components/log-customer-request-dialog"
import GetCompanyIdByDealId from "../../graphql/get-company-id-by-deal-id.graphql"
import ensureConnection from "../../utils/ensure-connection.server"
import {ensureCustomerRequestsEnabled} from "../../utils/ensure-customer-requests-enabled"

export const recordAction: RecordAction = {
    id: "deal-log-customer-request-action",
    onTrigger: async ({recordId}) => {
        await ensureConnection()
        if (await ensureCustomerRequestsEnabled()) {
            const companyRecordId = await getCompanyRecordId(recordId)
            await showDialog({
                title: "Log Customer Request",
                Dialog: ({hideDialog}: {hideDialog: () => void}) => (
                    <LogCustomerRequestDialog
                        companyRecordId={companyRecordId}
                        onDone={hideDialog}
                    />
                ),
            })
        }
    },
    label: "Log customer request",
    objects: ["deals"],
}

async function getCompanyRecordId(recordId: string) {
    const {hideToast} = await showToast({
        variant: "neutral",
        title: "Looking up company...",
        dismissable: false,
        durationMs: Number.POSITIVE_INFINITY,
    })

    try {
        const data = await runQuery(GetCompanyIdByDealId, {dealId: recordId})
        return data?.deal?.associated_company?.id
    } finally {
        hideToast()
    }
}
