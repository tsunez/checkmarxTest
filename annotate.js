// HACK TO WORK WITH GH Actions
//const require = global.require || global.process.mainModule._load;
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

const core = require('@actions/core');
const github = require('@actions/github');

console.log("Adding AST Result Annotations");
//const JEFF = core.getInput('JEFF');
const JEFF = process.env.JEFF;
console.log("Jeff: " + JEFF);
const GITHUB_TOKEN = core.getInput('secrets.GITHUB_TOKEN');
console.log("Token: " + GITHUB_TOKEN)
const octokit = github.getOctokit(GITHUB_TOKEN);

console.log("Got octokit")

const { context = {} } = github;
const { pull_request } = context.payload;

// Create comment
await octokit.issues.createComment({
    ...context.repo,
    issue_number: pull_request.number,
    body: 'Thank you for submitting a pull request! We will try to review this as soon as we can.'
});

console.log("Token: " + GITHUB_TOKEN)

console.log("Done creating AST tokens")