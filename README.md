[![CircleCI](https://circleci.com/gh/extenda/tech-radar.svg?style=svg)](https://circleci.com/gh/extenda/tech-radar)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=extenda_tech-radar&metric=alert_status)](https://sonarcloud.io/dashboard?id=extenda_tech-radar)

# Extenda Retail Tech Radar

This project contains the data points and a web frontend for the [Extenda Retail Tech Radar](https://tech-radar.extendaretail.com).

The Tech Radar aims to inspire and support teams at Extenda Retail to pick the best technologies for their projects.
It is way to share experience and knowledge between the teams and to create transparency about the technology direction of Extenda Retail. The Tech Radar also becomes a list of dos and don'ts, what to try and to avoid in order to increase success.

The Tech Radar is available at:

  - https://tech-radar.extendaretail.com

## How to Contribute

The radar content is maintained in the `radar` directory. To suggest changes or submit a new proposed entry to the radar do the following:

  1. Fork this repository
  2. Make changes in your fork
      - See [Development](#development) for more info
      - See [Semantic Versioning](#semantic-versioning) on how to format commit messages
  3. Open a pull request motivating the change
  4. The pull request is automatically published in [#tech-radar](https://extendaretail.slack.com/channels/tech-radar)
  5. If approved, the pull request is merged by the [maintainers](#maintainers)

### Vote on Pull Requests

To promote change, everyone is encouraged to vote on active pull requests. We use the slack channel [#tech-radar](https://extendaretail.slack.com/channels/tech-radar) to discuss changes. In the end, pull requests are reviewed and merged by the Tech Radar [maintainers](#maintainers).

## Semantic Versioning

The Tech Radar is versioned with semantic versioning. Increment version as follows:

  - `PATCH` version increments only for bug fixes and radar changes that doesn't change the recommendations in the radar
  - `MINOR` version increments for every radar blip content change
  - `MAJOR` version increments for major (incompatible) changes such as radar quadrant changes

Versioning is controlled with commit messages adhering to the [angular convention](https://github.com/angular/angular.js/blob/master/DEVELOPERS.md#-git-commit-guidelines).
The commit message consists of a **header**, **body** and **footer**. The **header** has a **type**, **scope** and **subject**:
```
<type>(<scope>): <subject>
<BLANK LINE>
<body>
<BLANK LINE>
<footer>
```
The **header** is mandatory and the **scope** of the header is optional.

For this project, use one of the follow values for **type**:

  - **feat**: New or changed radar content
  - **fix**: A fix to existing radar content
  - **docs**: Documentation change, not related to radar content
  - **style**: Changes that do not affect the meaning of code (white-space, formatting)
  - **perf**: A code change that improves performance
  - **chore**: Changes to the build process or auxiliary tools and libraries such as documentation generation

All commit messages in `master` should define type **type** of change. For changes to the radar contents, use:

  - **feat**: for new radar content
  - **fix**: for minor improvements to text on existing radar content

The other type of changes are normally not used when modifying the radar blip contents.

For bumping `MAJOR` version you need to add **BREAKING CHANGE** in the footer, as an example:
```
chore: Bumping major version

BREAKING CHANGE: This will trigger `major` bump.
```

## Development

Start by installing dependencies:
```bash
$ npm install
```

Next, make sure to install [pre-commit](https://pre-commit.com) hooks.
```bash
$ pre-commit install
```

To start a development server that automatically refresh as you make changes to the radar contents, run the following:
```bash
$ npm start
```
This will open the Tech Radar in your default browser.
The radar is running on http://localhost:8080.

### Radar Blip Format

Each blip (entry) on the radar is stored in a YAML file under the `radar` directory. Blips are assigned to quadrant categories and ranked according to the assessment rings in the radar.

The format of a blip is as follows:
```yaml
name: Entry name # Required
logo: https://domain.com/logo.png # Optional logo URL
shortname: Short # Optional. Use only if name is too long for the radar blip
active: true # Optional. If set to `false`, the blip is hidden on the visual radar
blip: # A list of blip positions. Add a new entry every time the blip moves
  - date: 2019-05-21 # Required. The date the blip is created or changed
    ring: ASSESS # Required. The position at date, One of ADOPT, TRIAL, ASSESS, HOLD
  - date: 2019-05-25
    ring: ADOPT
description: |
  A required, short description of the technology.
  This entry can be multiple lines and supports Markdown.
rationale: |
  A required rationale to explain why the technology is assessed in its current ring.
  This entry can be multiple lines and supports Markdown.
related: # Optional list of related entries
  - qa/semver.yaml # Relative path of related entry from radar dir.
tags: # Optional list of tags.
  - devops # one lowercase word or kebab-case
  - test
```

There are two scripts to validate radar entries. To use them, first install the required Python dependencies:

```bash
$ npm run pip:install
```

To run YAML lint, run the following:
```bash
$ npm run yaml:lint
```

And to validate the YAML against its schema definition, use:
```bash
$ npm run yaml:validate
```

### Docker

The Tech Radar is packaged into a Docker image. The image is automatically built
on `package`, but can also be built manually.

```bash
$ docker build -t tech-radar .
```

And to run a container, you'd run it in a way similar to this:

```bash
$ docker run --rm -it -p 8080:80 tech-radar
```
The Tech Radar would now be available at http://localhost:8080

It is also possible to run the development server in Docker:

```bash
$ docker run --rm -it -v $(pwd):/home -w /home -p 8080:8080 node:alpine sh -c "npm i; npm start"
```

## Release Process

The Tech Radar is released with a CI/CD pipeline, where every commit to `master` is deployed to production.
Every build is automatically versioned according to commit messages adhering to the [angular convention](https://github.com/angular/angular.js/blob/master/DEVELOPERS.md#-git-commit-guidelines).

## Maintainers

The Tech Radar maintainers are the members of the following teams:

  - [radar-maintainers](https://github.com/orgs/extenda/teams/radar-maintainers)
  - [admins](https://github.com/orgs/extenda/teams/admins)


## Acknowledgements

  * The Tech Radar visualization is based on Zalando's MIT licensed [radar visualization](https://github.com/zalando/tech-radar).
  * This project is licensed under the [MIT license](https://github.com/extenda/tech-radar/blob/master/LICENSE).
