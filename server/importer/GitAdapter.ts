import simpleGit, { SimpleGit, SimpleGitProgressEvent } from 'simple-git';
import { rmSync, mkdtempSync } from 'fs'
import { PassThrough } from 'stream'
import { v4 as uuidv4 } from 'uuid'
import { mappings, mappingKeys } from './mappings'

export default class GitAdapter {
    #gitClient: SimpleGit
    #tmpDir: string

    constructor (outputStream: PassThrough, tmpDir?: string) {
        const progressCallback = ({method, stage, progress}: SimpleGitProgressEvent) => {
            outputStream.write(`Running ${method} ${stage} stage ${progress}% complete \r`);
        }
        
        this.#tmpDir = tmpDir ?? mkdtempSync(`github-importer-${uuidv4().split('-')[0]}`)
        this.#gitClient = simpleGit(this.#tmpDir, { progress: progressCallback })
    }

    #getRepositoryRemote (projectName: string) {
        if(!Object.keys(mappings).includes(projectName)) {
            throw new Error(`[Git] can't find mapping for ${projectName}`)
        }
  
        return mappings[projectName as mappingKeys].gitlabCloneURL
    }

    async applyPatch (patch: string, message: string, author: string) {
        await this.#gitClient.applyPatch(patch)
        await this.#gitClient.commit(['-m', message, `--author=${author}`, '-n'])
    }

    async cloneFromGitlab (repositoryName: string) {
        const remote = this.#getRepositoryRemote(repositoryName)

        await this.#gitClient.clone(remote, '.', ['--progress'])
    }

    async checkout (remote: {URL: string, branch: string, name: string}, localBranch: string) {
        await this.#gitClient.addRemote(remote.name, remote.URL);

        await this.#gitClient.fetch(remote.name, remote.branch)

        await this.#gitClient.checkout(localBranch, [`${remote.name}/${remote.branch}`])
    }

    async pushBranch (repositoryName: string, localBranch: string, useForce = false) {
        const remote = this.#getRepositoryRemote(repositoryName)
        await this.#gitClient.push(remote, localBranch, [useForce ? '--force' : '', origin])
    }

    async getBranchByTicket (jiraTicket: string) {
        const searchPattern = `*${jiraTicket.toLowerCase()}*auto-imported-from-github`

        const gitOutput = await this.#gitClient.branch(['--list', '-a', searchPattern])

        return gitOutput
    }

    async squashAndRenameCommits (jiraTicket: string, prNumber: number, firstCommit: { SHA: string, message: string }, squash?: boolean) {
        if (squash) {
            await this.#gitClient.reset(['--soft', firstCommit.SHA])
        }

        const newCommitMessage = `${jiraTicket} - ${firstCommit.message}\nfixes #${prNumber}`
        await this.#gitClient.commit(['--amend', '-m', newCommitMessage])
    }

    teardown () {
        return rmSync(this.#tmpDir, { recursive: true })
    }
}
