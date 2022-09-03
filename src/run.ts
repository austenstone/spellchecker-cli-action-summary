import * as core from '@actions/core';
import * as github from '@actions/github';
import { readFileSync } from 'fs';
import { Endpoints } from "@octokit/types";

interface Input {
  'github-token': string;
  'file-json': string;
  'files-changed': string;
}

export function getInputs(): Input {
  const result = {} as Input;
  result['github-token'] = core.getInput('github-token');
  result['file-json'] = core.getInput('file-json');
  result['files-changed'] = core.getInput('files-changed');
  return result;
}

const MAX_ANNOTATIONS = 50;

const run = async (): Promise<void> => {
  try {
    const input = getInputs();
    const octokit: ReturnType<typeof github.getOctokit> = github.getOctokit(input['github-token']);

    const changedFiles = input['files-changed']?.split('\n');
    const fileName = input['file-json'];
    const ownerRepo = { owner: github.context.repo.owner, repo: github.context.repo.repo }

    const text = readFileSync(fileName, "utf8");
    const allMistakes = JSON.parse(text);
    const allRows = allMistakes.map(file => {
      return file.messages.map(mistake => {
        const repoPath = `${github.context.serverUrl}/${github.context.repo.owner}/${github.context.repo.repo}`;
        const githubURL = encodeURI(`${repoPath}/blob/${github.context.sha}/${mistake.file}?plain=1#L${mistake.line}`);
        return [
          `${mistake.actual}`,
          `${mistake.expected.length ? mistake.expected.join(', ') : '-'}`,
          `\n\n[${mistake.file}](${githubURL})`,
          mistake
        ];
      });
    }).reduce((a, b) => a.concat(b), []);
    const tableRows = allRows.map(row => row.slice(0, 3))

    const wordCountRows: {
      [key: string]: number;
    } = tableRows.reduce((dic, row) => {
      dic[row[0]] = dic[row[0]] ? dic[row[0]] + 1 : 1;
      return dic;
    }, {});
    const wordCountRowsSorted = Object.entries(wordCountRows).sort((a, b) => b[1] - a[1]);

    const summary = core.summary
      .addHeading('Spell Check', 1)
      .addHeading(`Found ${tableRows.length} misspelled words`, 2)
      .addTable([
        [{ data: 'Actual', header: true }, { data: 'Expected', header: true }, { data: 'File', header: true }],
        ...tableRows.slice(0, 3000).map(row => row.slice(0, 3))
      ])
      .addHeading('Commonly misspelled words', 2)
      .addTable([
        [{ data: 'Word', header: true }, { data: 'Count', header: true }],
        ...wordCountRowsSorted.map(wc => [wc[0], wc[1].toString()]).slice(0, 50)
      ]);
    const body = summary.stringify();
    await summary.write()
    core.info(`✅ Summary created!`);

    if (github.context.eventName === 'pull_request') {
      const checkRequest: Endpoints['POST /repos/{owner}/{repo}/check-runs']['parameters'] = {
        ...ownerRepo,
        name: 'Spell Check Changed Files',
        head_sha: github.context.payload.pull_request?.head.sha || github.context.sha,
        status: 'completed',
        output: {
          title: 'Spell check must pass',
          summary: 'Please ensure all words are spelled correctly'
        },
        conclusion: 'success'
      };
      const newMistakes = allRows.filter(row => changedFiles.includes(row[3]?.file));
      if (newMistakes.length && checkRequest.output) {
        checkRequest.output.annotations = newMistakes.slice(0, MAX_ANNOTATIONS).map(row => {
          const message = row[3];
          return {
            path: message.file,
            start_line: message.location.start.line,
            end_line: message.location.end.line,
            annotation_level: 'failure',
            message: message.message,
            start_column: message.location.start.column,
            end_column: message.location.end.column
          }
        });
        checkRequest.conclusion = 'failure';
      } else {
        checkRequest.conclusion = 'success';
      }
      
      try {
        await octokit.rest.checks.create(checkRequest);
      } catch {
        core.warning(`⚠️ Failed to create check with annotations`);
        delete checkRequest.output?.annotations;
        core.info(`🔁 Retrying to create check without annotations...`)
        await octokit.rest.checks.create(checkRequest);
      }
      core.info(`✅ Check 'Spell Check Changed Files' created!`);
    } else {
      let exists;
      try {
        const q = `is:issue state:open repo:${github.context.repo.owner}/${github.context.repo.repo}`;
        const searchResponse = await octokit.rest.search.issuesAndPullRequests({ q });
        exists = searchResponse.data.items[0];
      } catch (error) {
        core.info('No open issue found');
      }

      let issueResponse;
      if (exists) {
        issueResponse = await octokit.rest.issues.update({
          ...ownerRepo,
          issue_number: exists.number,
          body
        })
        core.notice(`Issue updated: ${issueResponse.data.html_url}`);
        const commentResponse = await octokit.rest.issues.createComment({
          ...ownerRepo,
          issue_number: exists.number,
          body: '✅ Spell check updated!'
        })
        core.notice(`Comment created: ${commentResponse.data.html_url}`);
      } else {
        issueResponse = await octokit.rest.issues.create({
          ...ownerRepo,
          title: 'Spell Check',
          body
        })
        core.notice(`Issue created: ${issueResponse.data.html_url}`);
      }
    }
  } catch (error) {
    core.startGroup(error instanceof Error ? error.message : JSON.stringify(error));
    core.info(JSON.stringify(error, null, 2));
    core.endGroup();
    throw error;
  }
};

export default run;
