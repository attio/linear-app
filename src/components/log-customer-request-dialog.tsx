import {isErrored} from "@attio/fetchable"
import {Button, Divider, Forms, showToast, useForm} from "attio/client"
import type {CreateIssueInput, CustomerNeedCreateInput} from "../linear"
import {queryClient} from "../app/extensions/company-customer-request-count/extension"
import getOrCreateCustomer from "../utils/server/get-or-create-customer.server"
import {CompaniesCombobox} from "./comboboxes/companies-combobox"
import {ProjectIssuesCombobox} from "./comboboxes/project-issues-combobox"
import {TeamsCombobox} from "./comboboxes/teams-combobox"
import createCustomerNeedServer from "./create-customer-need.server"
import createIssue from "./create-issue.server"

const NEW_ISSUE_OPTION = "NEW"

const formSchema = {
    team: Forms.string(),
    title: Forms.string(),
    addTo: Forms.string(),
    description: Forms.string().optional(),
    companyRecordId: Forms.string(),
    attachmentUrl: Forms.string().optional().url(),
}

async function handleCreateIssue(input: CreateIssueInput) {
    const {hideToast} = await showToast({
        title: "Creating issue...",
        dismissable: false,
        variant: "neutral",
    })

    try {
        const result = await createIssue(input, {requestUsing: "user-connection"})
        if (isErrored(result)) throw new Error(result.error.errorMessage)
        return result.value
    } finally {
        await hideToast()
    }
}

async function getCustomer(companyRecordId: string) {
    const {hideToast} = await showToast({
        variant: "neutral",
        title: "Looking up customer...",
        dismissable: false,
        durationMs: Number.POSITIVE_INFINITY,
    })

    const result = await getOrCreateCustomer(companyRecordId).finally(hideToast)
    if (isErrored(result)) throw new Error(result.error.errorMessage)
    return result.value
}

async function createCustomerNeed({
    companyRecordId,
    ...input
}: Omit<CustomerNeedCreateInput, "customerId"> & {companyRecordId: string}) {
    const customer = await getCustomer(companyRecordId)
    const {hideToast} = await showToast({
        title: "Creating customer request...",
        dismissable: false,
        variant: "neutral",
    })
    const result = await createCustomerNeedServer(
        {...input, customerId: customer.id},
        {requestUsing: "user-connection"}
    ).finally(hideToast)
    if (isErrored(result)) {
        console.error("createCustomerNeed failed", result.error)
        showToast({title: result.error.errorMessage, variant: "error"})
        throw new Error(result.error.errorMessage)
    }
    await showToast({title: "Customer request created", variant: "success"})
    return result.value
}

export type LogCustomerRequestFormSchema = typeof formSchema

export function LogCustomerRequestDialog({
    companyRecordId,
    onDone,
    description = "",
    attachmentUrl = "",
}: {
    companyRecordId?: string
    description?: string
    attachmentUrl?: string
    onDone: () => void
}) {
    const {Form, TextInput, SubmitButton, Combobox, RichTextInput, WithState, InputGroup} = useForm(
        formSchema,
        {
            companyRecordId,
            description,
            addTo: "",
            title: "",
            team: "",
            attachmentUrl,
        }
    )
    return (
        <Form
            onSubmit={async (values) => {
                try {
                    if (values.addTo.startsWith("project")) {
                        const projectId = values.addTo.split(":")[1]
                        await createCustomerNeed({
                            body: values.description || "",
                            companyRecordId: values.companyRecordId,
                            projectId,
                            attachmentUrl: values.attachmentUrl || undefined,
                        })
                    } else if (values.addTo.startsWith("issue")) {
                        const issueId = values.addTo.split(":")[1]
                        await createCustomerNeed({
                            body: values.description || "",
                            companyRecordId: values.companyRecordId,
                            issueId,
                            attachmentUrl: values.attachmentUrl || undefined,
                        })
                    } else {
                        const issue = await handleCreateIssue({
                            title: values.title,
                            teamId: values.team,
                        })
                        await createCustomerNeed({
                            body: values.description || "",
                            companyRecordId: values.companyRecordId,
                            issueId: issue.id,
                            attachmentUrl: values.attachmentUrl || undefined,
                        })
                    }
                    if (values.companyRecordId) {
                        queryClient.invalidateQueries({
                            queryKey: ["company-customer-request-count", values.companyRecordId],
                        })
                    }
                    onDone()
                } catch (error) {
                    showToast({
                        variant: "error",
                        title: "Error logging customer request",
                        text: error instanceof Error ? error.message : undefined,
                    })
                }
            }}
        >
            <CompaniesCombobox Combobox={Combobox} companyId={companyRecordId} />

            <RichTextInput
                label="Customer request details"
                name="description"
                placeholder="Add request details..."
            />
            <TextInput label="Source URL" name="attachmentUrl" placeholder="Paste source link..." />
            <Divider />
            <ProjectIssuesCombobox Combobox={Combobox} />
            <WithState values>
                {({values}: {values: {addTo: string}}) =>
                    values.addTo === NEW_ISSUE_OPTION ? (
                        <InputGroup>
                            <TextInput label="Issue title" name="title" placeholder="Issue title" />
                            <TeamsCombobox Combobox={Combobox} />
                        </InputGroup>
                    ) : (
                        // biome-ignore lint/complexity/noUselessFragments: WithState requires JSX.Element, cannot return null
                        <></>
                    )
                }
            </WithState>
            <Button label="Cancel" variant="secondary" onClick={onDone} />
            <SubmitButton label="Log request" />
        </Form>
    )
}
