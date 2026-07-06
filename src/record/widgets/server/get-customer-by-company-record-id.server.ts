import {linearApi} from "../../../linear"

export default async function getCustomerByCompanyRecordId(companyRecordId: string) {
    return linearApi({requestUsing: "user-connection"}).customer.getByCompanyRecordId(
        companyRecordId
    )
}
