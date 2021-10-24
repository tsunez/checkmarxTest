// HACK TO WORK WITH GH Actions
//const require = global.require || global.process.mainModule._load;
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { Octokit } = require('@octokit/rest');
const { createAppAuth } = require("@octokit/auth-app");
import * as core from '@actions/core';
import * as github from '@actions/github';
import { createActionAuth } from "@octokit/auth-action";

const auth = createActionAuth();
const authentication = await auth();
// {
//   type: 'token',
//   token: 'v1.1234567890abcdef1234567890abcdef12345678',
//   tokenType: 'oauth'
// }


console.log("Adding AST Result Annotations");
// Removed these
const GH_TOKEN = process.env.GH_TOKEN;

const APP_GH_KEY = process.env.APP_GH_KEY;
const GITHUB_RUN_ID = process.env.GITHUB_RUN_ID;
//const APP_ID = process.env.APP_ID;
//const APP_INSTALL_ID = process.env.APP_INSTALL_ID;
//const APP_CLIENT_ID = process.env.APP_ClIENT_ID;
//const APP_SECRET = process.env.APP_SECRET;
//const APP_KEY = process.env.APP_KEY;
const APP_CLIENT_ID = process.env.APP_CLIENT_ID;

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;


console.log("RUN ID: " + GITHUB_RUN_ID);
console.log("GH TOken: " + GITHUB_TOKEN);

// Use actions environment variable GITHUB_TOKEN
//const auth = createActionAuth();
//const authentication = await auth();

// Token based auth, if tokens are supported
//const octokit = new Octokit({
//  auth: GITHUB_TOKEN,
//});

const octokit = new Octokit({});

// Get GitHub not a constructor
//const octokit = new github.GitHub(String(APP_GH_KEY));


//const octokit = new Octokit({
//  baseUrl: 'https://api.github.<my domain>.com'
//})


const url =  '/repos/{owner}/{repo}/{path}'; 
const checkURL = '/repos/{owner}/{repo}/check-runs/{check_run_id}';
const owner = 'tsunez';
const repo = 'checkmarxTest';
const ref =  'heads/gh_action_test';


/* This is supposed to check the token
console.log("Checking tokenV2");
const val = await octokit.rest.apps.checkToken({
  APP_CLIENT_ID,
  APP_GH_KEY,
});
console.log(val)
*/


async function createCheck(check_name, title, annotations, commitSha) {
  const req = {
    owner,
    repo,
    ref: commitSha,
  }
  console.log("STEP 1");
  const res = await octokit.rest.checks.listForRef(req);
  //console.log(res)

  if(res.data.total_count >= 1) {
    console.log("Found check");
    //console.log(res.data.check_runs[0]);
 console.log(res.data.check_runs[0]);
    const check_run_id = res.data.check_runs[0].id
    console.log("CHECK RUN ID: " + check_run_id);

    const update_req = {
      header: {
        authorization: ("token: " + GITHUB_TOKEN)
      },
      repo,
      check_run_id,
      output: {
        title,
        summary: `${annotations.length} errors(s) found`,
        annotations: annotations.slice(0, 50),
      }
    }
    console.log("STep 2")
    //console.log(update_req)
    //await octokit.rest.checks.update(update_req).
	//catch(error => { console.log('caught', error.message); });
    await runtest4(check_run_id); 
    await runtest5(check_run_id, annotations); 

    console.log("DONE V4")
  } else {
    console.log("Didn't find check");
  } 
}

// Will show authentication error
const runTest2 = async(check_run_id) => {
  await octokit.request('PATCH /repos/{owner}/{repo}/check-runs/{check_run_id}', {
    owner,
    repo,
    check_run_id,
    name: 'runTest2'
  }).
    catch(error => { console.log('caught', error.message); });
}

// Will show authentication error
const runTest3 = async(check_run_id) => {
  console.log("Check run id: " + check_run_id);
  await octokit.request('PATCH /repos/{owner}/{repo}/check-runs/{check_run_id}', {
    headers: {
      authorization: `token ${APP_GH_KEY}`
    },
    owner,
    repo,
    check_run_id,
    name: 'runTest2'
  }).
    catch(error => { console.log('caught', error.message); });
}

// This one will work
const runTest4 = async(check_run_id) => {
  console.log("Check run id: " + check_run_id);
  await octokit.request('PATCH /repos/{owner}/{repo}/check-runs/{check_run_id}', {
    headers: {
      authorization: `token ${GITHUB_TOKEN}`
    },
    owner,
    repo,
    check_run_id,
    name: 'runTest2'
  }).
    catch(error => { console.log('caught', error.message); });
  console.log("Check done");
}

// Create the annotation
const runTest5 = async(check_run_id, annotations) => {
  console.log("Check run id: " + check_run_id);
  await octokit.request('PATCH /repos/{owner}/{repo}/check-runs/{check_run_id}', {
    headers: {
      authorization: `token ${APP_GH_KEY}`
    },
    owner,
    repo,
    check_run_id,
    output: {
      title: "Test title!",
      summary: `${annotations.length} errors(s) found`,
      annotations: annotations.slice(0, 50),
    }
  }).
    catch(error => { console.log('caught', error.message); });
}







const createAnotations = async () => {

    // Locate the branch to put the annotations on
    const { data: refData } = await octokit.git.getRef({
        owner,
        repo,
        ref
    })
    const commitSha = refData.object.sha
    console.log("sha: " + commitSha)
    //console.log("core sha: " + core.getInput('commit_sha'))
    let check_run_id = GITHUB_RUN_ID;
   

    //
    /// Lets add some annotations
    //
    let annotations = [];
    const annotation = makeAnnotation({
        path: ".github/workflows/main.yml",
        start_line: parseInt(1),
        end_line: parseInt(3),
	annotation_level: "notice",
        message: "Test desc",
      });
    annotations.push(annotation);

    //const checkName = core.getInput('check_name');
    //console.log("Check Name: " + checkName);
    const checkName = "cx Errors Happened!";
    await createCheck(checkName, 'failures detected', annotations, commitSha);


    //
    /// Get annotations
    //
    /*
    const result = await octokit.request({
        //headers: {
        //    authorization: `token ${APP_GH_KEY}`
        //},
        owner,
        repo,
	check_run_id,
        checkURL,
        method: 'GET'
      })
    console.log(result)
    */
    console.log("Done creating check")
}
createAnotations()


function makeAnnotation(raw) {
  // Chop `./` off the front so that Github will recognize the file path
  /*
  const normalized_path = raw.filename.replace('./', '');
  const annotation_level = (getAnnotationLevel() == 'warning') ?
    <const>'warning' :
    <const>'failure';
  */
  const normalized_path = 'InSecure.php';
  const annotation_level = 'warning';
  return {
    path: normalized_path,
    start_line: 4,
    end_line: 8,
    start_column: 0,
    end_column: 0,
    annotation_level: annotation_level,
    message: 'I am a message'
  }
}



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
// getContents();


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
