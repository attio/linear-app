import {linearApi} from "../../../linear"

export default async function getCustomerNeedCount(customerId: string) {
    return linearApi({requestUsing: "user-connection"}).customerNeed.getCount(customerId)
}
