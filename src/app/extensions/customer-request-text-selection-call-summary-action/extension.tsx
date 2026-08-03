import {showDialog, experimental_extensions} from "attio/client"
import {LogCustomerRequestDialog} from "../../../components/log-customer-request-dialog"

export default experimental_extensions.defineExtension({
    type: "call-recording-summary-text-action",
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
})
