// HACK TO WORK WITH GH Actions
//const require = global.require || global.process.mainModule._load;
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

//const core = require('@actions/core');
//const Github = require('@actions/github');
//const github = require('@actions/github');

console.log("Adding AST Result Annotations");
const GH_TOKEN = process.env.GH_TOKEN;
//const octokit = github.getOctokit(GITHUB_TOKEN);


//console.log("token: " + GH_TOKEN)

//const github = new Github(GITHUB_TOKEN)
//await octokit.createCheck("AST Annotations")
// octokit.c
/*
const result = await octokit.request('POST /repos/{owner}/{repo}/check-runs', {
    owner: 'tsunez',
    repo: 'checkmarxTest',
    name: 'name',
    head_sha: 'head_sha'
});
console.log(result)
*/

const { Octokit } = require('@octokit/rest');
const octokit = new Octokit({
    auth: GH_TOKEN,
});

const owner = 'tsunez';
const repo = 'checkmarxTest';
const author = {
    name: 'Jeff Armstrong',
    email: 'jarmstrong@nezasoft.com',
};
const url =  '/repos/{owner}/{repo}/{path}'; 
const ref =  'heads/gh_action_test';


// Test Code
const createAnotations = async () => {

    // Locate the branch to put the annotations on
    const { data: refData } = await octokit.git.getRef({
        owner,
        repo,
        ref
    })
    const headSha = refData.object.sha
    console.log("sha: " + headSha)

    // Create the check run
    await octokit.request({
        owner,
        repo,
        url,
        method: 'POST',
        name: 'TestCheck',
        path: 'check-runs',
        headSha
      })  
    console.log("Done creating check")
}
createAnotations()


const getContents = async () => {
    // Create the annotation
    let head = "gh_action_test"
    const { data } = await octokit.request({
        owner,
        repo,
        url,
        method: 'GET',
        head,
        path: 'contents',
    });
    console.log(data)
}
//getContents();


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

console.log("Done creating AST tokens")