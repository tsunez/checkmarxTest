// HACK TO WORK WITH GH Actions
//const require = global.require || global.process.mainModule._load;
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { Octokit } = require('@octokit/rest');
const { createAppAuth } = require("@octokit/auth-app");

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

console.log("RUN ID: " + GITHUB_RUN_ID);

// Token based auth, if tokens are supported
/*
const octokit = new Octokit({
    auth: GH_TOKEN,
});
*/

const octokit = new Octokit({
});

//const octokit = new Octokit({
//  baseUrl: 'https://api.github.<my domain>.com'
//})

//const octokit = new Octokit({
//  baseUrl: 'https://api.github.com'
//})
/*
octokit.authenticate({
  type: 'basic',
  username: 'jarmstrong@nezasoft.com',
  password: GH_TOKEN
});
*/


const url =  '/repos/{owner}/{repo}/{path}'; 
const checkURL = '/repos/{owner}/{repo}/check-runs/{check_run_id}';
const owner = 'tsunez';
const repo = 'checkmarxTest';
const ref =  'heads/gh_action_test';

const createAnotations = async () => {

    // Locate the branch to put the annotations on
    const { data: refData } = await octokit.git.getRef({
        owner,
        repo,
        ref
    })
    const headSha = refData.object.sha
    console.log("sha: " + headSha)
    
    let check_run_id = GITHUB_RUN_ID;
   

    //
    /// Lets add some annotations
    //
    let annotations = [];
    const annotation = makeAnnotation({
        filename: "",
        lineNumber: parseInt(1),
        columnNumber: parseInt(1),
        errorCode: "",
        errorDesc: "",
      });
    annotations.push(annotation);

    const checkName = core.getInput('check_name');
    console.log("Check Name: " + checkName);
    //await createCheck(checkName, 'failures detected', annotations);


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
    end_line: 4,
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
