import type {App} from "attio/client"
import {showDialog} from "attio/client"
import {LogCustomerRequestDialog} from "../components/log-customer-request-dialog"

export const customerRequestTextSelectionCallInsightAction: App.CallRecording.Insight.TextAction = {
    id: "customer-request-text-selection-call-insight-action",
    label: "Log customer request",
    onTrigger: async ({markdown}) => {
        await showDialog({
            title: "Log Customer Request",
            Dialog: ({hideDialog}: {hideDialog: () => void}) => {
                const insight = markdown
                    .split("\n")
                    .map((line) => `> ${line}`)
                    .join("\n")
                return (
                    <LogCustomerRequestDialog
                        description={`## Call Insight\n${insight}\n`}
                        onDone={hideDialog}
                    />
                )
            },
        })
    },
}
