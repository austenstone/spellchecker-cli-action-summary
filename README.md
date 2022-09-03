# Action
An [Action](https://docs.github.com/en/actions) that creates job summaries, status checks, and issues for markdown spelling errors reported by [tbroadley/spellchecker-cli](https://github.com/tbroadley/spellchecker-cli).

## Issue & Job Summary
Get a table of all the misspelled words with suggested fixes and links directly to the file/line. The job summary is always created and the issue summary is created if the job is not of event type `push` or `pull_request`. The issue summary contains all misspelled words but the job summary only contains results from the files that have changed if the event is of type `push` or `pull_request`.

## Status Checks
Status checks will be reported if the event is of type `pull_request`.
### Annotations
The status checks contain inline annotations that will appear in the files changed view of the pull request. See [Getting started with the Checks API](https://docs.github.com/en/rest/guides/getting-started-with-the-checks-api).

## Usage
Create a workflow (eg: `.github/workflows/seat-count.yml`). See [Creating a Workflow file](https://help.github.com/en/articles/configuring-a-workflow#creating-a-workflow-file).

#### Reusable Workflow Example
Use the reusable workflow to easily implement this action in your repository.
```yml
name: Spell Check .md
on:
  schedule:
    - cron: "0 0 1 * *"

jobs:
  spellcheck:
    uses: austenstone/spellchecker-cli-action-summary/.github/workflows/spellcheck.yml@main
```

## ➡️ Inputs
Various inputs are defined in [`action.yml`](action.yml):

| Name | Description | Default |
| --- | - | - |
| github&#x2011;token | Token to use to authorize. | ${{&nbsp;github.token&nbsp;}} |
| file-json | JSON file containing the list of files to check. | ${{&nbsp;file-json&nbsp;}} |
| files-changed | List of files to check. | ${{&nbsp;files-changed&nbsp;}} |

<!-- 
## ⬅️ Outputs
| Name | Description |
| --- | - |
| output | The output. |
-->

## Further help
To get more help on the Actions see [documentation](https://docs.github.com/en/actions).
