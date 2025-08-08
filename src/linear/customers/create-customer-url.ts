export function createCustomerUrl(workspaceSlug: string, customerId: string): string {
    return `https://linear.app/${workspaceSlug}/customer/${customerId}`
}
