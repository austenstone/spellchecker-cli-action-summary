# Action

An [Action](https://docs.github.com/en/actions).

## Usage
Create a workflow (eg: `.github/workflows/seat-count.yml`). See [Creating a Workflow file](https://help.github.com/en/articles/configuring-a-workflow#creating-a-workflow-file).

<!-- 
### PAT(Personal Access Token)

You will need to [create a PAT(Personal Access Token)](https://github.com/settings/tokens/new?scopes=admin:org) that has `admin:org` access.

Add this PAT as a secret so we can use it as input `github-token`, see [Creating encrypted secrets for a repository](https://docs.github.com/en/enterprise-cloud@latest/actions/security-guides/encrypted-secrets#creating-encrypted-secrets-for-a-repository). 
### Organizations

If your organization has SAML enabled you must authorize the PAT, see [Authorizing a personal access token for use with SAML single sign-on](https://docs.github.com/en/enterprise-cloud@latest/authentication/authenticating-with-saml-single-sign-on/authorizing-a-personal-access-token-for-use-with-saml-single-sign-on).
-->

#### Example
```yml
name: TypeScript Action Workflow
on:
  workflow_dispatch:

jobs:
  run:
    name: Run Action
    runs-on: ubuntu-latest
    steps:
      - uses: austenstone/action-typescript@main
```

## ➡️ Inputs
Various inputs are defined in [`action.yml`](action.yml):

| Name | Description | Default |
| --- | - | - |
| github&#x2011;token | Token to use to authorize. | ${{&nbsp;github.token&nbsp;}} |

<!-- 
## ⬅️ Outputs
| Name | Description |
| --- | - |
| output | The output. |
-->

## Further help
To get more help on the Actions see [documentation](https://docs.github.com/en/actions).


Let's introduce some mispelled sentences.

I started my schooling as the majority did in my area, at the local primarry school. I then
went to the local secondarry school and recieved grades in English, Maths, Phisics,
Biology, Geography, Art, Graphical Comunication and Philosophy of Religeon. I'll not
bore you with the 'A' levels and above.
Notice the ambigous English qualification above. It was, in truth, a cource dedicated to
reading "Lord of the flies" and other gems, and a weak atempt at getting us to
commprehend them. Luckilly my middle-class upbringing gave me a head start as I was
already aquainted with that sort of langauge these books used (and not just the Peter and
Jane books) and had read simillar books before. I will never be able to put that paticular
course down as much as I desire to because, for all its faults, it introduced me to
Steinbeck, Malkovich and the wonders of Lenny, mice and pockets.
My education never included one iota of grammar. Lynn Truss points out in "Eats,
shoots and leaves" that many people were excused from the rigours of learning English
grammar during their schooling over the last 30 or so years because the majority or
decision-makers decided one day that it might hinder imagination and expresion (so
what, I ask, happened to all those expresive and imaginative people before the ruling?).
