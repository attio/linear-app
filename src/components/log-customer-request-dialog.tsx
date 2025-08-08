import {Button, Divider, Forms, Row, showToast, useForm} from "attio/client"
import getOrCreateCustomer from "../linear/customers/get-or-create-customer.server"
import createIssueServer from "../linear/issues/create-issue.server"
import type {CreateIssueInput} from "../linear/issues/schema"
import createCustomerNeedServer from "../linear/needs/create-customer-need.server"
import type {CustomerNeedCreateInput} from "../linear/needs/schema"
import {queryClient} from "../record/widgets/company-customer-request-count-widget"
import {CompaniesCombobox} from "./comboboxes/companies-combobox"
import {ProjectIssuesCombobox} from "./comboboxes/project-issues-combobox"
import {TeamsCombobox} from "./comboboxes/teams-combobox"

const NEW_ISSUE_OPTION = "NEW"

const formSchema = {
    team: Forms.string(),
    title: Forms.string(),
    addTo: Forms.string(),
    description: Forms.string().optional(),
    companyRecordId: Forms.string(),
    attachmentUrl: Forms.string().optional().url(),
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
    const {Form, TextInput, SubmitButton, Combobox, Experimental_RichTextInput, WithState} =
        useForm(formSchema, {
            companyRecordId,
            description,
            addTo: "",
            title: "",
            team: "",
            attachmentUrl,
        })
    return (
        <Form
            onSubmit={async (values) => {
                if (values.addTo.startsWith("project")) {
                    const projectId = values.addTo.split(":")[1]
                    await createCustomerNeed({
                        body: values.description,
                        companyRecordId: values.companyRecordId,
                        projectId,
                        attachmentUrl: values.attachmentUrl || undefined,
                    })
                } else if (values.addTo.startsWith("issue")) {
                    const issueId = values.addTo.split(":")[1]
                    await createCustomerNeed({
                        body: values.description,
                        companyRecordId: values.companyRecordId,
                        issueId,
                        attachmentUrl: values.attachmentUrl || undefined,
                    })
                } else {
                    const issue = await createIssue({
                        title: values.title,
                        teamId: values.team,
                    })
                    await createCustomerNeed({
                        body: values.description,
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
            }}
        >
            <CompaniesCombobox Combobox={Combobox} companyId={companyRecordId} />

            <Experimental_RichTextInput
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
                        <Row>
                            <TextInput label="Issue title" name="title" placeholder="Issue title" />
                            <TeamsCombobox Combobox={Combobox} />
                        </Row>
                    ) : (
                        // biome-ignore lint/complexity/noUselessFragments: WithState requires JSX.Element, cannot return null
                        <></>
                    )
                }
            </WithState>
            <Button label="Cancel" variant="secondary" onClick={onDone} keyboardHint="esc" />
            <SubmitButton label="Log request" />
        </Form>
    )
}

async function createIssue(input: CreateIssueInput) {
    const {hideToast} = await showToast({
        title: "Creating issue...",
        dismissable: false,
        variant: "neutral",
    })
    const issue = await createIssueServer(input)
    await hideToast()
    if (!issue) {
        throw new Error("Failed to create issue")
    }
    return issue
}

async function getCustomer(companyRecordId: string) {
    const {hideToast} = await showToast({
        variant: "neutral",
        title: "Looking up customer...",
        dismissable: false,
        durationMs: Number.POSITIVE_INFINITY,
    })

    return await getOrCreateCustomer(companyRecordId).finally(hideToast)
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
    const customerNeed = await createCustomerNeedServer({...input, customerId: customer.id})
        .catch((error) => {
            showToast({title: error.message, variant: "error"})
            throw error
        })
        .finally(hideToast)
    if (!customerNeed) {
        showToast({title: "Failed to create customer request", variant: "error"})
        throw new Error("Failed to create customer request")
    }
    await showToast({title: "Customer request created", variant: "success"})
    return customerNeed
}
