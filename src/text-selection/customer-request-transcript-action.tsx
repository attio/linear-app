import type {App} from "attio/client"
import {showDialog} from "attio/client"
import {LogCustomerRequestDialog} from "../components/log-customer-request-dialog"

export const customerRequestTranscriptSelectionAction: App.CallRecording.Transcript.TextAction = {
    id: "customer-request-transcript-selection-action",
    label: "Log customer request",
    onTrigger: async ({
        transcript,
        url,
    }: {
        transcript: {speaker: string; text: string}[]
        url: string
    }) => {
        await showDialog({
            title: "Log customer request",
            Dialog: ({hideDialog}: {hideDialog: () => void}) => {
                const quote = transcript
                    .map(({speaker, text}) => `> **${speaker}**: ${text}`)
                    .join("\n> \n")
                return (
                    <LogCustomerRequestDialog
                        description={`## Transcript\n${quote}\n`}
                        attachmentUrl={url}
                        onDone={hideDialog}
                    />
                )
            },
        })
    },
}
