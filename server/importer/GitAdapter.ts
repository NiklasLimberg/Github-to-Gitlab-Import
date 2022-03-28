
import { rmSync, mkdtempSync } from 'fs'
import { sep } from 'path'
import { Stream } from 'stream'
import { v4 as uuidv4 } from 'uuid'
import { execa } from 'execa'
import { mappings, mappingKeys } from './mappings'

export default class GitAdapter {
    #tmpDir: string
    #outputStream: Stream
    #abortSignal: AbortSignal

    constructor (outputStream: Stream, abortSignal: AbortSignal, tmpDir?: string) {
        this.#tmpDir = tmpDir ?? mkdtempSync(`github-importer${sep}${uuidv4().split('-')[0]}`)
        this.#outputStream = outputStream
        this.#abortSignal = abortSignal
    }

    #getRepositoryRemote (projectName: string) {
        if(!Object.keys(mappings).includes(projectName)) {
            throw new Error(`[Gitlab] can't find mapping for ${projectName}`)
        }
  
        return mappings[projectName as mappingKeys].gitlabCloneURL
    }

    async #runGitCommand (gitArgs: string[], errorMessage?: string) {
        const gitOutput = await execa('git', gitArgs, {
            cwd: this.#tmpDir,
            stdout: this.#outputStream,
            signal: this.#abortSignal
        })

        if (gitOutput.failed) {
            throw new Error(`[git] ${errorMessage}`)
        }

        return gitOutput
    }

    async applyPatch (patch: string, message: string, author: string) {
        await this.#runGitCommand(['apply', patch], `failed to apply patch ${patch}`)
        await this.#runGitCommand(['commit', '-m', message, `--author=${author}`, '-n'], 'failed to commit patch')
    }

    async cloneFromGithub (repositoryName: string) {
        const remote = this.#getRepositoryRemote(repositoryName)

        await this.#runGitCommand(['clone', remote, '.'], `clone of ${remote} failed`)
    }

    async checkout (remote: {URL: string, branch: string, name: string}, localBranch: string) {
        await this.#runGitCommand(['remote', 'add', remote.name, remote.URL], `failed to add remote ${remote.URL}`)

        await this.#runGitCommand(['fetch', remote.name, remote.branch], `failed fetch remote for ${remote.branch} on ${remote.URL}`)

        await this.#runGitCommand(['checkout', '-b', localBranch, `${remote.name}/${remote.branch}`], `could't checkout branch ${remote.branch} from remote ${remote.URL}`)
    }

    async pushBranch (localBranch: string, useForce = false) {
        await this.#runGitCommand(['push', localBranch, useForce ? '--force' : '', origin], `push of branch ${localBranch} failed`)
    }

    async getBranchByTicket (jiraTicket: string) {
        const searchPattern = `*${jiraTicket.toLowerCase()}*auto-imported-from-github`

        const gitOutput = await this.#runGitCommand(['branch', '--list', '-a', searchPattern], `couldn't list branches in ${this.#tmpDir}`)

        return gitOutput.stdout.trim()
    }

    async squashAndRenameCommits (jiraTicket: string, prNumber: number, firstCommit: { SHA: string, message: string }, squash?: boolean) {
        if (squash) {
            await this.#runGitCommand(['reset', '--soft', firstCommit.SHA], `failed to squash commits ${this.#tmpDir}`)
        }

        const newCommitMessage = `${jiraTicket} - ${firstCommit.message}\nfixes #${prNumber}`
        await this.#runGitCommand(['commit', '--amend', '-m', newCommitMessage], `failed to squash commits ${this.#tmpDir}`)
    }

    teardown () {
        return rmSync(this.#tmpDir, { recursive: true })
    }
}
