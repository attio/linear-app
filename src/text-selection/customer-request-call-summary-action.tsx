import type {App} from "attio/client"
import {showDialog} from "attio/client"
import {LogCustomerRequestDialog} from "../components/log-customer-request-dialog"

export const customerRequestTextSelectionCallSummaryAction: App.CallRecording.Summary.TextAction = {
    id: "customer-request-text-selection-call-summary-action",
    label: "Log customer request",
    onTrigger: async ({markdown}) => {
        await showDialog({
            title: "Log Customer Request",
            Dialog: ({hideDialog}: {hideDialog: () => void}) => {
                const summary = markdown
                    .split("\n")
                    .map((line) => `> ${line}`)
                    .join("\n")
                return (
                    <LogCustomerRequestDialog
                        description={`## Call Summary\n${summary}\n`}
                        onDone={hideDialog}
                    />
                )
            },
        })
    },
}
