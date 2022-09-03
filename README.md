# Action
An [Action](https://docs.github.com/en/actions) that creates job summaries, status checks, and issues for markdown spelling errors reported by [tbroadley/spellchecker-cli](https://github.com/tbroadley/spellchecker-cli).

## Issue & Job Summary
Get a table of all the misspelled words with suggested fixes and links directly to the file/line. The job summary is always created and the issue summary is created if the job is not of event type `push` or `pull_request`. The issue summary contains all misspelled words but the job summary only contains results from the files that have changed if the event is of type `push` or `pull_request`.

![image](https://user-images.githubusercontent.com/22425467/188254502-5f07ea12-f65e-4956-b46e-62645e63b02e.png)

## Status Checks
Status checks will be reported if the event is of type `pull_request`.
### Annotations
The status checks contain inline annotations that will appear in the files changed view of the pull request. See [Getting started with the Checks API](https://docs.github.com/en/rest/guides/getting-started-with-the-checks-api).

![image](https://user-images.githubusercontent.com/22425467/188254398-e1d99d0b-bc40-4787-b1fc-898b6ebf2a4e.png)

> **Note**
> <br>The check may fail with annotations if the exact line number and columns aren't output.<br>See open issue https://github.com/tbroadley/spellchecker-cli/issues/102

## Dictionary
You can use 

## Usage
Create a workflow (eg: `.github/workflows/seat-count.yml`). See [Creating a Workflow file](https://help.github.com/en/articles/configuring-a-workflow#creating-a-workflow-file).

#### Reusable Workflow Example
Use the reusable workflow [`spellcheck.yml`](.github/workflows/spellcheck.yml) to easily implement this action in your repository.
```yml
name: Spell Check .md
on:
  schedule:
    - cron: "0 0 1 * *"

jobs:
  spellcheck:
    uses: austenstone/spellchecker-cli-action-summary/.github/workflows/spellcheck.yml@main
```
#### Reusable Workflow Example Dictionary Add
You can also add dictionary functionality.
```yml
name: Spell Check Dictionary Add
on:
  workflow_dispatch:
    inputs:
      words:
        type: string
        description: Words to add to the dictionary
        required: true

jobs:
  spellcheck:
    uses: austenstone/spellchecker-cli-action-summary/.github/workflows/spellcheck-dictionary-add.yml@main
    with:
      words: ${{ inputs.words }}
```

## ➡️ Inputs
Various inputs are defined in [`action.yml`](action.yml):

| Name | Description | Default |
| --- | - | - |
| github-token | Token to use to authorize. | ${{ github-token }} |
| file-json | JSON file containing the list of files to check. | ${{ file-json }} |
| files-changed | List of files to check. | ${{ files-changed }} |

<!-- 
## ⬅️ Outputs
| Name | Description |
| --- | - |
| output | The output. |
-->

## Further help
To get more help on the Actions see [documentation](https://docs.github.com/en/actions).
