![Commit](https://github.com/extenda/tech-radar/workflows/Commit/badge.svg)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=extenda_tech-radar&metric=alert_status)](https://sonarcloud.io/dashboard?id=extenda_tech-radar)
![GitHub tag (latest SemVer)](https://img.shields.io/github/v/tag/extenda/tech-radar?label=version)
![GitHub](https://img.shields.io/github/license/extenda/tech-radar)

# Extenda Retail Tech Radar

This project contains the data points and a web frontend for the [Extenda Retail Tech Radar](https://tech-radar.extendaretail.com).

The Tech Radar aims to inspire and support teams at Extenda Retail to pick the best technologies for their projects.
It is way to share experience and knowledge between the teams and to create transparency about the technology direction of Extenda Retail. The Tech Radar also becomes a list of dos and don'ts, what to try and to avoid in order to increase success.

The Tech Radar is available at:

  - https://tech-radar.extendaretail.com

## How to Contribute

The radar content is maintained in the `radar` directory. To suggest changes or submit a new proposed entry to the radar do the following:

  1. Pull this repository
  2. Checkout a new branch
  3. Make changes in your branch
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

Versioning is controlled with commit messages adhering to [conventional commits](https://conventionalcommits.org).
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
  - **chore**: Changes to the build process or auxiliary tools and libraries such as documentation generation

All commit messages MUST define type **type** of change. For changes to the radar contents, use:

  - **feat**: for new radar content
  - **fix**: for minor improvements to text on existing radar content

The other type of changes are normally not used when modifying the radar blip contents.

For bumping `MAJOR` version you need to add **BREAKING CHANGE** in the footer, as an example:
```
chore: Bump major version

BREAKING CHANGE: This will trigger `major` bump.
```

Finally, all commits must be written in imperative mood (i.e, _Add_ not _Added_).

## Development

Start by installing dependencies:
```bash
npm ci
```

Next, make sure to install [pre-commit](https://pre-commit.com) hooks. In addition to ensure file formats it also
checks commit messages.
```bash
pre-commit install -t pre-commit -t commit-msg
```

To start a development server that automatically refresh as you make changes to the radar contents, run the following:
```bash
npm start
```

This will open the Tech Radar in your default browser.
The radar is running on http://localhost:8080.

To run the development server with authentication enabled:
```bash
npm run backend &
npm run frontend
```
This will open the Tech Radar in your default browser.
The radar is running on http://localhost:8080 and requires Google login.
A development server that validates the Google ID token runs on http://localhost:3000.

### Radar Blip Format

Each blip (entry) on the radar is stored in a YAML file under the `radar` directory. Blips are assigned to quadrant categories and ranked according to the assessment rings in the radar.

The format of a blip is as follows:
```yaml
name: Entry name # Required
logo: https://domain.com/logo.png # Optional logo URL
shortname: Short # Optional. Use only if name is too long for the radar blip
blip: # A list of blip positions. Add a new entry every time the blip moves
  - date: 2019-05-21 # Required. The date the blip is created or changed
    ring: ASSESS # Required. The position at date, One of ADOPT, TRIAL, ASSESS, HOLD, ARCHIVE
  - date: 2019-05-25
    ring: ADOPT
description: |
  A required, short description of the technology.
  This entry can be multiple lines and supports Markdown.
rationale: |
  A required rationale to explain why the technology is assessed in its current ring.
  This entry can be multiple lines and supports Markdown.
license: # Optional, but recommended to always include
  # Only if open source
  open-source:
    name: MIT # Required open-source license. Must match enum in schema.
    link: http://github.com/org/repo/LICENSE # Optional link to license
    description: |
      Optional description of the open source license. Do not use unless something must be explained,
      for example with dual licenses. Supports markdown.
  # Only if commercial
  commercial:
    company: Google # Required company name. Must match name in companies.yaml.
    description: |
      Optional description of the commercial license that supports Markdown.
related: # Optional list of related entries
  - qa/semver.yaml # Relative path of related entry from radar dir.
tags: # Optional list of tags.
  - devops # one lowercase word or kebab-case
  - test
```

There are two scripts to validate radar entries. To use them, first install the required Python dependencies:

```bash
npm run pip:install
```

To run YAML lint, run the following:
```bash
npm run yaml:lint
```

And to validate the YAML against its schema definition, use:
```bash
npm run yaml:validate
```

### Supported Open-Source Licenses

The following open source license names are valid for use in the radar blips.

| Name       | Description                                                    |
|------------|----------------------------------------------------------------|
| Apache-1.1 | Apache Software License Version 1.1                            |
| Apache-2.0 | Apache Software License Version 2.0                            |
| BSD-2      | Simplified BSD License (BSD 2-Clause License)                  |
| BSD-3      | New BSD License (BSD 3-Clause License)                         |
| BSD-4      | Original BSD License (BSD 4-Clause License)                    |
| BSD-style  | BSD-style license, see project license for details             |
| CC0        | Creative Commons Public Domain                                 |
| CDDL-1.0   | Common Development and Distribution License (CDDL) Version 1.0 |
| CDDL-1.1   | Common Development and Distribution License (CDDL) Version 1.1 |
| EPL-1.0    | Eclipse Public License (EPL) Version 1.0                       |
| EDL-1.0    | Eclipse Distribution License (EDL) Version 1.0                 |
| LGPL-2.1   | GNU Lesser General Public License (LGPL) Version 2.1           |
| LGPL-3.0   | GNU Lesser General Public License (LGPL) Version 3.0           |
| GPL-CE     | GNU General Public License (GPL) with the Classpath Exception  |
| MIT        | The MIT License                                                |
| MPL-1.0    | Mozilla Public License (MPL) Version 1.0                       |
| MPL-1.1    | Mozilla Public License (MPL) Version 1.1                       |
| MPL-2.0    | Mozilla Public License (MPL) Version 2.0                       |
| PostgreSQL | The PostgreSQL License                                         |
| Public     | Public Domain                                                  |

If you find a library with a license that isn't in this list it must be analyzed in detail.
The list only contains license types analyzed for compliance with Extenda Retail products.

For projects with multiple licenses, select the most permissible one and make sure it is compatible with Extenda Retail's licensing.

### Supported Commercial Licenses

The [`radar/companies.yaml`](radar/companies.yaml) file contains the list of companies allowed for commercial licenses.
If you add a radar entry that requires a license from some other company, this means the company
must be added to the `companies.yaml` file.

### Docker

The Tech Radar is packaged into a Docker image. To build the radar, use this command:

```bash
npm run build
docker build -t tech-radar .
```

And to run a container, you'd run it in a way similar to this:

```bash
docker run --rm -it -p 8080:8080 tech-radar
```
The Tech Radar would now be available at http://localhost:8080

It is also possible to run the development server in Docker:

```bash
docker run --rm -it -v $(pwd):/home -w /home -p 8080:8080 node:alpine sh -c "npm i; npm start"
```

## Release Process

The Tech Radar is released with a CI/CD pipeline, where every commit to `master` is deployed to production.
Every build is automatically versioned according to commit messages adhering to [conventional commits](https://conventionalcommits.org).

## Maintainers

The Tech Radar maintainers are the members of the following teams:

  - [radar-maintainers](https://github.com/orgs/extenda/teams/radar-maintainers)
  - [admins](https://github.com/orgs/extenda/teams/admins)


## Acknowledgements

  * The Tech Radar visualization is based on Zalando's MIT licensed [radar visualization](https://github.com/zalando/tech-radar).
  * This project is licensed under the [MIT license](https://github.com/extenda/tech-radar/blob/master/LICENSE).
