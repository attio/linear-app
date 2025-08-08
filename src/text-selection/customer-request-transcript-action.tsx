import {type CallRecordingTranscriptTextSelectionAction, showDialog} from "attio/client"
import {LogCustomerRequestDialog} from "../components/log-customer-request-dialog"

export const callRecordingTranscriptTextSelectionAction: CallRecordingTranscriptTextSelectionAction =
    {
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
