# Extenda Retail Tech Radar

This project contains the data points and a generator for the [Extenda Retail Tech Radar](http://tech-radar.extenda.io).

The Tech Radar aims to inspire and support teams at Extenda Retail to pick the best technologies for their projects.
It is way to share experience and knowledge between the teams and to create transparency about the technology direction of Extenda Retail. The Tech Radar also becomes a list of dos and don'ts, what to try and to avoid in order to increase success.

## How to Contribute

The radar content is maintained in the `radar` directory. To suggest changes or submit a new proposed entry to the radar to the following:

  1. Fork this repository
  2. Make changes in your fork, see [Development](#Development) for more info
  3. Open a pull request motivating the change

Pull requests will be reviewed by the Tech Radar working group.

## Development

Start by installing dependencies:
```bash
$ npm install
```

Next, make sure to install pre-commit hooks.
```bash
$ pre-commit install
```

To build a copy of the radar, run the following:

```bash
$ npm run build
```

This will build the radar and prepare an archived version that can be committed and pushed to GitHub.
As an alternative to the above script, it is possible to start a development server that will refresh automatically as you make changes to the radar contents.

```bash
$ npm start
```
The Tech Radar is now running on http://localhost:3000

### Radar Blip Format

Each blip (entry) on the radar is stored in a YAML file under the `radar` directory. Blips are assigned to quadrant categories and ranked according to the assessment rings in the radar.

The format of a blip is as follows:
```yaml
name: Entry name # Required
shortname: Short # Optional. Use only if name is too long for the radar blip
blip:
  active: true # Optional. If set to `false`, the blip is hidden
  since: 2 # Required. The first edition the blip appeared
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
on release, but can also be built manually.

```bash
$ docker build -t tech-radar .
```

And to run a container, you'd run it in a way similar to this:

```bash
$ docker run --rm -it -p 3000:80 tech-radar
```
The Tech-Radar would now be available at http://localhost:3000

### Release the Radar

The Tech Radar is updated roughly every 6 months by a working group consisting of technologists from different branches of Extenda Retail.

To release the radar, use the following command:
```bash
$ npm run release
```
This will perform the following steps:
  1. Build the current radar edition
  2. Archive and commit the edition
  3. Tag the edition
  4. Update `package.json` to next edition
  5. Build a Docker image
  6. Push changes to GitHub
  7. Push the Docker image to ECR

If the last step fails, take action to push to image manually to ECR. This step would fail if
  * User isn't authenticated for the Docker ECR
  * User doesn't have permission to push to ECR

After the Docker image has been published, the `tech-radar` ECS instance must be redeployed.

## Acknowledgements

  * The Tech Radar visualization is based on Zalando's MIT licensed [radar visualization](https://github.com/zalando/tech-radar).
  * This project is licensed under the [MIT license](https://github.com/extenda/tech-radar/blob/master/LICENSE).
