import type {App} from "attio/client"

import {companyLogCustomerRequestAction} from "./record/actions/company-log-customer-request-action"
import {companyViewCompanyAction} from "./record/actions/company-view-company-action"
import {dealLogCustomerRequestAction} from "./record/actions/deal-log-customer-request-action"
import {personLogCustomerRequestAction} from "./record/actions/person-log-customer-request-action"
import {companyCustomerRequestCount} from "./record/widgets/company-customer-request-count-widget"
import {customerRequestTextSelectionCallInsightAction} from "./text-selection/customer-request-call-insight-action"
import {customerRequestTextSelectionCallSummaryAction} from "./text-selection/customer-request-call-summary-action"
import {customerRequestTranscriptSelectionAction} from "./text-selection/customer-request-transcript-action"

export const app: App = {
    record: {
        actions: [
            companyLogCustomerRequestAction,
            companyViewCompanyAction,
            dealLogCustomerRequestAction,
            personLogCustomerRequestAction,
        ],
        bulkActions: [],
        widgets: [companyCustomerRequestCount],
    },
    callRecording: {
        insight: {
            textActions: [customerRequestTextSelectionCallInsightAction],
        },
        summary: {
            textActions: [customerRequestTextSelectionCallSummaryAction],
        },
        transcript: {
            textActions: [customerRequestTranscriptSelectionAction],
        },
    },
}
