import type {PostToLinearOptions} from "./client/linear-gql-client"
import {createCustomerApi} from "./customers/api"
import {createIssueApi} from "./issues/api"
import {createLabelApi} from "./labels/api"
import {createCustomerNeedApi} from "./needs/api"
import {createOrganizationApi} from "./organizations/api"
import {createPriorityApi} from "./priorities/api"
import {createProjectApi} from "./projects/api"
import {createTeamApi} from "./teams/api"
import {createUserApi} from "./users/api"
import {createWebhookApi} from "./webhooks/api"
import {createWorkflowStateApi} from "./workflow-states/api"

export type {PostToLinearOptions} from "./client/linear-gql-client"
export type {LinearCustomer} from "./customers/schema"
export type {CreateIssueInput, LinearIssue} from "./issues/schema"
export type {LinearIssueLabel} from "./labels/schema"
export type {CustomerNeedCreateInput} from "./needs/schema"
export type {LinearOrganization} from "./organizations/schema"
export type {LinearPriority} from "./priorities/schema"
export type {LinearProject} from "./projects/schema"
export type {LinearTeam} from "./teams/schema"
export type {LinearUser} from "./users/schema"
export type {LinearWorkflowState} from "./workflow-states/schema"

export function linearApi(options: PostToLinearOptions) {
    return {
        customer: createCustomerApi(options),
        customerNeed: createCustomerNeedApi(options),
        issue: createIssueApi(options),
        label: createLabelApi(options),
        organization: createOrganizationApi(options),
        priority: createPriorityApi(options),
        project: createProjectApi(options),
        team: createTeamApi(options),
        user: createUserApi(options),
        webhook: createWebhookApi(options),
        workflowState: createWorkflowStateApi(options),
    }
}
