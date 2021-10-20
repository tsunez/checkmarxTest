// HACK TO WORK WITH GH Actions
//const require = global.require || global.process.mainModule._load;
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

//const core = require('@actions/core');
//const Github = require('@actions/github');
const github = require('@actions/github');

console.log("Adding AST Result Annotations");
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
console.log("Token: " + GITHUB_TOKEN)
const octokit = github.getOctokit(GITHUB_TOKEN);
console.log("Got octokit")

//const github = new Github(GITHUB_TOKEN)
await octokit.createCheck("AST Annotations")

const result = await octokit.request('POST /repos/{owner}/{repo}/check-runs', {
    owner: 'tsunez',
    repo: 'checkmarxTest',
    name: 'name',
    head_sha: 'head_sha'
});
console.log(result)

//const { context = {} } = github;
//const { pull_request } = context.payload;

//console.log(octokit.issues)
//octokit.
// Create comment
//octokit.issues.createComment()
/*
await octokit.issues.createComment({
    ...context.repo,
    issue_number: pull_request.number,
    body: 'Thank you for submitting a pull request! We will try to review this as soon as we can.'
});
*/

console.log("PtsToken: " + GITHUB_TOKEN)

console.log("Done creating AST tokens")