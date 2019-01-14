# Extenda Retail Tech Radar

This project contains the data points and a generator for the [Extenda Retail Tech Radar](http://tech-radar.extenda.io).

The Tech Radar aims to inspire and support teams at Extenda Retail to pick the best technologies for their projects.
It is way to share experience and knowledge between the teams and to create transparency about the technology direction of Extenda Retail. The Tech Radar also becomes a list of dos and don'ts, what to try and to avoid in order to increase success.

The Tech Radar is available at:

  - https://tech-radar.extenda.io
  - https://tech-radar.extenda.io/latest - For latest development version

## How to Contribute

The radar content is maintained in the `radar` directory. To suggest changes or submit a new proposed entry to the radar do the following:

  1. Fork this repository
  2. Make changes in your fork, see [Development](#Development) for more info
  3. Open a pull request motivating the change
  4. Post a link to your pull request in [#tech-radar](https://extendaretail.slack.com/channels/tech-radar)

### Vote on Pull Requests

To promote change, everyone is encouraged to vote on active pull requests. We use pull request comments to discuss changes. In the end, pull requests are reviewed and merged by the Tech Radar maintainers.

### Maintainers

The Tech Radar maintainers are the members of the following teams:

  - [radar-maintainers](https://github.com/orgs/extenda/teams/radar-maintainers)
  - [admins](https://github.com/orgs/extenda/teams/admins)

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
The Tech Radar is now running on http://localhost:3000

### Radar Blip Format

Each blip (entry) on the radar is stored in a YAML file under the `radar` directory. Blips are assigned to quadrant categories and ranked according to the assessment rings in the radar.

The format of a blip is as follows:
```yaml
version: 1 # YAML format version (to cope with future changes)
name: Entry name # Required
shortname: Short # Optional. Use only if name is too long for the radar blip
blip:
  active: true # Optional. If set to `false`, the blip is hidden
  since: "1.1.0" # Required. The first MAJOR.MINOR.PATCH version the blip appeared
  ring: ADOPT # Required. One of ADOPT, TRIAL, ASSESS, HOLD
  moved: false # Optional. Set to `true` if an existing blip changes ring
description: |
  A required, short description of the technology.
  This entry can be multiple lines and supports Markdown.
rationale: |
  A required rationale to explain why the technology is assessed in its current ring.
  This entry can be multiple lines and supports Markdown.
related: # Optional list of related entries
  - name: My Entry # The entry name
    file: my_entry.html # The entry filename
  - name: Second Entry
    file: file2.html
```

### Docker

The Tech Radar is packaged into a Docker image. The image is automatically built
on `package`, but can also be built manually.

```bash
$ docker build -t tech-radar .
```

And to run a container, you'd run it in a way similar to this:

```bash
$ docker run --rm -it -p 3000:80 tech-radar
```
The Tech Radar would now be available at http://localhost:3000

It is also possible to run the development server in Docker:

```bash
$ docker run --rm -it -v $(pwd):/home -w /home -p 3000:3000 node:alpine sh -c "npm i; npm start"
```

## Release Process

The Tech Radar is released with a CI/CD pipeline, where every commit to `master` is deployed to production.

To build a release package, run the following on CI:

```bash
$ npm run package
```

This will build the following:

  - The latest tagged release
  - An archive of previous tags
  - The latest (edge) Tech Radar accessible at `/latest`

The release will be packaged into a Docker image tagged as

  - `tech-radar:latest`
  - `tech-radar:$(git rev-parse --short HEAD)`

Use the SHA tagged image on CI, retag it and publish to production.

### Semantic Versioning

The Tech Radar is versioned with semantic versioning. Increment version as follows:

  - `PATCH` version increments only for bug fixes and radar changes that doesn't change the recommendations in the radar
  - `MINOR` version increments for every radar blip content change
  - `MAJOR` version increments for major (incompatible) changes such as radar quadrant changes

The version should be changed when we modify content to the radar and we wish to promote the contents from `latest` to become the current (active) Tech Radar.

### How to Release the Tech Radar

Changing the Tech Radar version is a _manual_ step to be performed by a Tech Radar maintainer.

**The release should be performed on the `master` branch.**

To release the current version, run this command:

```bash
$ npm run release
```

The `release` script will perform the following actions:

  - Run a test build
  - Tag the `HEAD` with the current version in `package.json`
  - Bump the version in `package.json` to the next patch version
  - Push the new version and tags to GitHub

When the new tagged version has been pushed to GitHub it will be built and published by the CI/CD pipeline.

### How to Change the Version

Often, you'll find that you should bump the version before releasing the radar.

**The version should be changed on the `master` branch.**

  - Bump `MINOR` version if radar blips has been added or moved
  - Bump `MAJOR` version if incompatible changes has been made

There are two scripts available to bump respective versions

```bash
$ npm run version:minor
$ npm run version:major
```

The scripts will perform the following actions:

  - Bump the version in `package.json` to the next desired version
  - Push the new version to GitHub

## Acknowledgements

  * The Tech Radar visualization is based on Zalando's MIT licensed [radar visualization](https://github.com/zalando/tech-radar).
  * This project is licensed under the [MIT license](https://github.com/extenda/tech-radar/blob/master/LICENSE).
