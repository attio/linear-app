import {Workflows} from "attio/client"

export const issueOutcomeSchema = Workflows.OutcomeSchema.struct({
    issue_id: Workflows.OutcomeSchema.string().title("Issue ID"),
    title: Workflows.OutcomeSchema.string().title("Title"),
    identifier: Workflows.OutcomeSchema.string().title("Identifier"),
    description: Workflows.OutcomeSchema.string().title("Description").optional(),
    status_name: Workflows.OutcomeSchema.string().title("Status Name").optional(),
    status_id: Workflows.OutcomeSchema.string().title("Status ID").optional(),
    priority: Workflows.OutcomeSchema.number().title("Priority").optional(),
    due_date: Workflows.OutcomeSchema.string().title("Due Date").optional(),
    assignee_id: Workflows.OutcomeSchema.string().title("Assignee ID").optional(),
    assignee_name: Workflows.OutcomeSchema.string().title("Assignee Name").optional(),
    labels: Workflows.OutcomeSchema.array(Workflows.OutcomeSchema.string())
        .title("Labels")
        .optional(),
})

export const issueEventOutcomeSchema = Workflows.OutcomeSchema.struct({
    ...issueOutcomeSchema.fields,
    actor_id: Workflows.OutcomeSchema.string().title("Actor ID"),
    actor_name: Workflows.OutcomeSchema.string().title("Actor Name"),
})
