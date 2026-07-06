import {complete} from "@attio/fetchable"
import {beforeEach, describe, expect, it, vi} from "vitest"
import getIssue from "../server/get-issue.server"
import getIssues from "../server/get-issues.server"
import getProject from "../server/get-project.server"
import getProjects from "../server/get-projects.server"
import searchIssues from "../server/search-issues.server"
import searchProjects from "../server/search-projects.server"
import {mockLinearIssue, mockLinearProject} from "../test/linear-mocks"
import {createProjectsIssuesProvider} from "./projects-issues-options-provider"

vi.mock("../server/get-issue.server", () => ({default: vi.fn()}))
vi.mock("../server/get-issues.server", () => ({default: vi.fn()}))
vi.mock("../server/get-project.server", () => ({default: vi.fn()}))
vi.mock("../server/get-projects.server", () => ({default: vi.fn()}))
vi.mock("../server/search-issues.server", () => ({default: vi.fn()}))
vi.mock("../server/search-projects.server", () => ({default: vi.fn()}))

const mockGetIssue = vi.mocked(getIssue)
const mockGetProjects = vi.mocked(getProjects)
const mockSearchProjects = vi.mocked(searchProjects)
const mockGetIssues = vi.mocked(getIssues)
const mockSearchIssues = vi.mocked(searchIssues)
const mockGetProject = vi.mocked(getProject)

const project = mockLinearProject()
const issue = mockLinearIssue()

describe(createProjectsIssuesProvider, () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it("loads the default projects and issues when the query is empty", async () => {
        mockGetProjects.mockResolvedValue(complete([project]))
        mockGetIssues.mockResolvedValue(complete([issue]))

        const options = await createProjectsIssuesProvider({
            requestUsing: "user-connection",
        }).search("")

        expect(mockGetProjects).toHaveBeenCalledTimes(1)
        expect(mockGetIssues).toHaveBeenCalledTimes(1)
        expect(mockSearchProjects).not.toHaveBeenCalled()
        expect(mockSearchIssues).not.toHaveBeenCalled()
        expect(options).toEqual([
            {
                label: "Create new issue",
                value: "NEW",
                categoryLabel: "",
                icon: "NotePlus",
            },
            {
                label: "Project One",
                value: "project:project-1",
                categoryLabel: "Projects",
                icon: "Workspace",
            },
            {
                label: "Fix the dropdown",
                value: "issue:issue-1",
                categoryLabel: "Issues",
                description: "ECO-4401",
                icon: "Note",
            },
        ])
    })

    it("only queries the search endpoints when a query is provided", async () => {
        mockSearchProjects.mockResolvedValue(complete([project]))
        mockSearchIssues.mockResolvedValue(complete([issue]))

        const options = await createProjectsIssuesProvider({
            requestUsing: "user-connection",
        }).search("dropdown")

        expect(mockSearchProjects).toHaveBeenCalledWith("dropdown", {
            requestUsing: "user-connection",
        })
        expect(mockSearchIssues).toHaveBeenCalledWith("dropdown", {
            requestUsing: "user-connection",
        })
        expect(mockGetProjects).not.toHaveBeenCalled()
        expect(mockGetIssues).not.toHaveBeenCalled()
        expect(options.map((option) => option.value)).toEqual([
            "NEW",
            "project:project-1",
            "issue:issue-1",
        ])
    })

    it("includes the create new issue option by default", async () => {
        mockGetProjects.mockResolvedValue(complete([]))
        mockGetIssues.mockResolvedValue(complete([]))

        const options = await createProjectsIssuesProvider({
            requestUsing: "user-connection",
        }).search("")

        expect(options).toEqual([
            {
                label: "Create new issue",
                value: "NEW",
                categoryLabel: "",
                icon: "NotePlus",
            },
        ])
    })

    it("omits the create new issue option when showCreateNewOption is false", async () => {
        mockGetProjects.mockResolvedValue(complete([project]))
        mockGetIssues.mockResolvedValue(complete([issue]))

        const options = await createProjectsIssuesProvider({
            requestUsing: "user-connection",
            showCreateNewOption: false,
        }).search("")

        expect(options.map((option) => option.value)).toEqual([
            "project:project-1",
            "issue:issue-1",
        ])
    })

    it("resolves the NEW option without fetching", async () => {
        await expect(
            createProjectsIssuesProvider({requestUsing: "user-connection"}).getOption("NEW")
        ).resolves.toEqual({
            label: "Create new issue",
            categoryLabel: "",
            icon: "NotePlus",
        })
        expect(mockGetProjects).not.toHaveBeenCalled()
        expect(mockGetIssues).not.toHaveBeenCalled()
    })

    it("returns undefined for the NEW option when showCreateNewOption is false", async () => {
        await expect(
            createProjectsIssuesProvider({
                requestUsing: "user-connection",
                showCreateNewOption: false,
            }).getOption("NEW")
        ).resolves.toBeUndefined()
    })

    it("resolves a project option", async () => {
        mockGetProject.mockResolvedValue(complete(project))

        const option = await createProjectsIssuesProvider({
            requestUsing: "user-connection",
        }).getOption(`project:${project.id}`)

        expect(option).toEqual({
            label: project.name,
            categoryLabel: "Projects",
            icon: "Workspace",
        })
        expect(mockGetProject).toHaveBeenCalledWith(project.id, {requestUsing: "user-connection"})
    })

    it("resolves an issue option", async () => {
        mockGetIssue.mockResolvedValue(complete(issue))

        const option = await createProjectsIssuesProvider({
            requestUsing: "user-connection",
        }).getOption(`issue:${issue.id}`)

        expect(option).toEqual({
            label: issue.title,
            categoryLabel: "Issues",
            description: issue.identifier,
            icon: "Note",
        })
        expect(mockGetIssue).toHaveBeenCalledWith(issue.id, {requestUsing: "user-connection"})
    })

    it("returns undefined for an unknown option type", async () => {
        await expect(
            createProjectsIssuesProvider({requestUsing: "user-connection"}).getOption("unknown:123")
        ).resolves.toBeUndefined()
    })

    it("threads the workspace connection through every fetch", async () => {
        const provider = createProjectsIssuesProvider({requestUsing: "workspace-connection"})

        mockGetProjects.mockResolvedValue(complete([]))
        mockGetIssues.mockResolvedValue(complete([]))
        await provider.search("")
        expect(mockGetProjects).toHaveBeenCalledWith({requestUsing: "workspace-connection"})
        expect(mockGetIssues).toHaveBeenCalledWith({requestUsing: "workspace-connection"})

        mockSearchProjects.mockResolvedValue(complete([]))
        mockSearchIssues.mockResolvedValue(complete([]))
        await provider.search("dropdown")
        expect(mockSearchProjects).toHaveBeenCalledWith("dropdown", {
            requestUsing: "workspace-connection",
        })
        expect(mockSearchIssues).toHaveBeenCalledWith("dropdown", {
            requestUsing: "workspace-connection",
        })
    })
})
