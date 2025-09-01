import {runQuery, showToast, Widget} from "attio/client"
import React from "react"
import "event-target-polyfill"
import "yet-another-abortcontroller-polyfill"

import {QueryClient, QueryClientProvider, useSuspenseQuery} from "@tanstack/react-query"
import type {App} from "attio/client"
import GetCompanyById from "../../graphql/get-company-by-id.graphql"
import {createCustomerUrl} from "../../linear/customers/create-customer-url"
import getCustomerByCompanyRecordId from "../../linear/customers/get-customer-by-company-record-id.server"
import getCustomerNeedsCount from "../../linear/needs/get-customer-needs-count.server"
import {createEnableCustomersFeatureUrl} from "../../linear/organizations/create-enable-customers-feature-url"
import getOrganization from "../../linear/organizations/get-organization.server"
import {viewCompanyInLinear} from "../../utils/view-company-in-linear"

export const queryClient = new QueryClient()

const LoadingWidget = ({recordId}: {recordId: string}) => {
    const {data} = useSuspenseQuery({
        queryKey: ["company-customer-request-count", recordId],
        queryFn: () => load(recordId),
    })
    const {name, customerNeeds, customerUrl, enableCustomersUrl} = data
    return (
        <Widget.TextWidget
            onTrigger={async () => {
                if (enableCustomersUrl) {
                    window.open(enableCustomersUrl, "_blank")
                } else if (customerUrl) {
                    window.open(customerUrl, "_blank")
                } else {
                    // If you're triggering the widget, we know you've got a connection
                    // because we display a "no connection" widget if you don't.
                    await viewCompanyInLinear(recordId).catch((error) => {
                        showToast({
                            variant: "error",
                            title: "Error viewing company in Linear",
                            text: error.message,
                        })
                    })
                }
            }}
        >
            <Widget.Title>Linear</Widget.Title>
            {enableCustomersUrl ? (
                <>
                    <Widget.Text.Primary>Customer requests disabled</Widget.Text.Primary>
                    <Widget.Text.Secondary>Click to go to Linear settings</Widget.Text.Secondary>
                </>
            ) : (
                <>
                    <Widget.Text.Primary>{name}</Widget.Text.Primary>
                    <Widget.Text.Secondary>
                        {customerNeeds} customer request{customerNeeds === 1 ? "" : "s"}
                    </Widget.Text.Secondary>
                </>
            )}
        </Widget.TextWidget>
    )
}

export const companyCustomerRequestCount: App.Record.Widget = {
    id: "company-customer-request-count",
    label: "Customer requests",
    color: "#5e6ad2",
    Widget: ({recordId}: {recordId: string}) => {
        return (
            <QueryClientProvider client={queryClient}>
                <React.Suspense fallback={<Widget.Loading />}>
                    <LoadingWidget recordId={recordId} />
                </React.Suspense>
            </QueryClientProvider>
        )
    },
    objects: ["companies"],
}

async function load(recordId: string) {
    const [companyResult, customer, organization] = await Promise.all([
        runQuery(GetCompanyById, {companyId: recordId}),
        getCustomerByCompanyRecordId(recordId),
        getOrganization(),
    ])
    const domain = companyResult?.company?.domains?.[0]
    const name = companyResult?.company?.name ?? domain ?? "Unnamed Company"
    const customerNeeds = customer ? await getCustomerNeedsCount(customer.id) : 0
    return {
        name,
        customerNeeds,
        enableCustomersUrl: organization.customersEnabled
            ? null
            : createEnableCustomersFeatureUrl(organization.urlKey),
        customerUrl: customer ? createCustomerUrl(organization.urlKey, customer.id) : null,
    }
}
