# Radar Writer Agent

The **radar-writer** is a GitHub Copilot agent that helps you create new technology radar blips with proper formatting and suggestions.

## Quick Start

Open the Copilot chat in your JetBrains IDE and ask the agent:

```
@radar-writer I want to add a new technology to the radar
```

Or directly provide information:

```
@radar-writer Create a radar blip for "Kubernetes" - it's a container orchestration platform for managing containerized applications at scale
```

## What the Agent Does

The radar-writer agent will:

1. **Gather Information** - Ask you for technology details:
   - Technology name (required)
   - Description (required)
   - Rationale for inclusion (recommended)
   - License type (open-source or commercial)
   - Radar category/quadrant

2. **Research & Suggest**:
   - Scans existing radar entries to find related technologies
   - Analyzes tags from similar entries
   - Suggests 2-5 related entries to link
   - Recommends appropriate tags

3. **Generate YAML Template** - Creates a properly formatted YAML file following `radar_entry.schema.yaml`

4. **Refine Output** - Helps you:
   - Confirm or modify tags and related entries
   - Add license information
   - Set the ring (ADOPT, TRIAL, ASSESS, HOLD, ARCHIVE)
   - Set the date for the radar entry

## Radar Categories

Place your new entries in one of these categories:

- **ai/** - Artificial Intelligence and Machine Learning technologies
- **data_management/** - Data platforms, databases, and data tools
- **dev/** - Programming languages, frameworks, and development tools
- **infrastructure_ci_cd/** - Infrastructure, CI/CD, and DevOps tools
- **qa/** - Quality assurance and testing tools

## Schema Reference

All radar entries must follow the structure defined in `radar_entry.schema.yaml`:

### Required Fields

- **name** (string): Technology name
- **description** (string): Detailed description (supports markdown)
- **rationale** (string): Why this technology is on the radar
- **blip** (array): Version history with date and ring placement
  - **date** (YYYY-MM-DD): When the entry was added
  - **ring** (enum): ADOPT | TRIAL | ASSESS | HOLD | ARCHIVE

### Optional Fields

- **tags** (array): Search and categorization tags
- **related** (array): Paths to related radar entries (e.g., `dev/react.yaml`)
- **license** (object): Open-source or commercial license details
  - **open-source**: License name, link, and description
  - **commercial**: Company name and description
- **logo** (string): URL to technology logo
- **shortname** (string): Abbreviated name

## Example Usage

### Session 1: Basic Technology

```
User: @radar-writer Add a blip for Terraform - it's an Infrastructure as Code tool

Agent: I'll help you create a radar blip for Terraform. Let me ask a few clarifying questions:

1. Which category should this go in? (ai, data_management, dev, infrastructure_ci_cd, qa)
2. Is Terraform open-source or commercial?
3. Can you provide a brief description of what Terraform does?

User: It goes in infrastructure_ci_cd, it's open-source (Mozilla Public License 2.0), and it's used for provisioning infrastructure through code

Agent: [Searches existing entries, finds related technologies like Ansible, CloudFormation, etc.]
[Suggests tags: infrastructure, iac, terraform, cloud, provisioning]
[Shows generated YAML template]
```

### Session 2: Refining Details

```
User: Can you add Kubernetes and Docker as related entries?

Agent: [Updates the related section]
[Shows updated YAML]

User: Let me set the ring to TRIAL and add today's date

Agent: [Updates blip with current date and TRIAL ring]
[Shows final YAML]
```

## Generated File Example

When you're done, the agent will generate a YAML file like:

```yaml
name: Terraform
logo: https://www.terraform.io/assets/images/logo-text.svg
blip:
  - date: 2026-02-16
    ring: TRIAL
description: |
  Terraform is an open-source infrastructure as code software tool that enables you to safely
  and predictably create, change, and improve your infrastructure. It codifies cloud APIs into
  declarative configuration files.
rationale: |
  Terraform is a leading tool in infrastructure-as-code that provides a vendor-agnostic way
  to manage cloud infrastructure. It helps us maintain infrastructure consistency and enables
  infrastructure versioning and collaboration.
license:
  open-source:
    name: MPL-2.0
    link: https://github.com/hashicorp/terraform/blob/main/LICENSE
tags:
  - infrastructure
  - iac
  - infrastructure-ci-cd
  - cloud
related:
  - infrastructure_ci_cd/ansible.yaml
  - infrastructure_ci_cd/cloudformation.yaml
  - dev/docker.yaml
```

## Tips

1. **Be Specific**: Provide detailed descriptions so the agent can better suggest related entries
2. **Check Related Entries**: Review suggested related entries to ensure they're relevant
3. **Use Consistent Tags**: Tags should be lowercase and use hyphens instead of underscores
4. **Ring Progression**: Consider the progression path (ASSESS → TRIAL → ADOPT) when choosing a ring
5. **Rationale Matters**: A good rationale helps future readers understand the decision

## File Placement

After confirming the YAML content, save the file to:

```
radar/<category>/<technology-name>.yaml
```

For example:
- `radar/dev/vue.yaml`
- `radar/data_management/kafka.yaml`
- `radar/infrastructure_ci_cd/terraform.yaml`

## Validation

Before saving, you can ask the agent to validate the YAML:

```
@radar-writer Validate this YAML for me
```

The agent will check for:
- ✓ Required fields present
- ✓ Proper date format (YYYY-MM-DD)
- ✓ Valid ring values
- ✓ Related entries exist
- ✓ YAML syntax correctness
