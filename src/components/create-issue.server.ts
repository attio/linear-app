import {type CreateIssueInput, linearApi, type PostToLinearOptions} from "../linear"

export default async function createIssue(input: CreateIssueInput, options: PostToLinearOptions) {
    return linearApi(options).issue.create(input)
}
