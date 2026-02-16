# GitHub Copilot Agents

This directory contains GitHub Copilot agent definitions in markdown format. These agents are discoverable by IntelliJ IDEA and other JetBrains IDEs with GitHub Copilot integration.

## Available Agents

### radar-writer.agent.md
An AI agent that helps you create well-structured technology radar blips following the project's conventions and schema.

**Usage in IDE:**
```
@radar-writer Create a radar blip for [technology name]
```

**Capabilities:**
- Gather technology information and context
- Research related technologies in the radar
- Generate properly formatted YAML entries
- Suggest appropriate tags and categories
- Validate against the radar_entry.schema.yaml
- Help determine the right ring (ADOPT, TRIAL, ASSESS, HOLD, ARCHIVE)

## Agent Discovery

These agent definitions use the `.agent.md` extension and are automatically discovered by:
- GitHub Copilot in JetBrains IDEs (IntelliJ IDEA, WebStorm, etc.)
- GitHub Copilot CLI
- Other GitHub Copilot integrations that support agent discovery

## Creating New Agents

To create a new agent:

1. Create a new `.agent.md` file in this directory
2. Use a clear, descriptive name (e.g., `my-agent.agent.md`)
3. Include:
   - A descriptive title (H1)
   - Purpose section explaining what the agent does
   - Detailed instructions for how the agent should behave
   - Workflow or step-by-step process
   - Any relevant context or schema information
   - Examples of how to use the agent

4. Keep the structure clear with consistent markdown formatting
5. Make the agent discoverable by following the `.agent.md` naming convention

## File Format

Agent files follow this structure:
- `.agent.md` extension for automatic IDE discovery
- Markdown format for readable documentation
- Clear sections: Purpose, Workflow, Requirements, Examples
- Professional tone and comprehensive instructions
