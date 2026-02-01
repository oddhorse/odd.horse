# Claude Code Skills - ODDHORSE SITE

## What are Skills?

**Skills** are custom prompts that extend Claude Code's capabilities for your specific project. Think of them as reusable command templates that you can invoke with `/skillname`.

### Skills vs Hooks vs Agents

| Feature | Skills | Hooks | Agents |
|---------|--------|-------|--------|
| **When they run** | On-demand (`/skillname`) | Automatically (session events) | On-demand (background task) |
| **What they do** | Give Claude instructions | Run shell scripts | Execute multi-step tasks autonomously |
| **Example use** | "Review this PR" | "Start dev server" | "Research and implement feature" |
| **Interactivity** | Yes - Claude responds | No - just runs script | Limited - runs independently |
| **Best for** | Repeatable prompts | Automation | Complex workflows |

### When to Use Skills

Use skills when you have a **repeatable prompt pattern** that you use frequently:

- Code reviews with specific criteria
- Generating boilerplate with project conventions
- Deploying with specific steps
- Analyzing code for specific patterns
- Creating content with project style guide

### Skill File Format

Skills are markdown files in `.claudeskills/` directory:

```markdown
# Skill Name

Instructions for Claude Code to follow...

Can include:
- Specific analysis criteria
- Step-by-step procedures
- Project-specific context
- Output format requirements
```

## Installed Skills

### /review-css
Reviews CSS files against project conventions:
- Semantic HTML standards
- Comment verbosity requirements
- Modern CSS feature usage
- Hybrid organization (global vs inline)

### /new-page
Creates a new page following Eleventy conventions:
- Generates .njk template
- Adds frontmatter
- Creates inline styles section
- Updates navigation if needed

### /deploy
Deployment workflow for this project:
- Checks git status
- Runs production build
- Validates build output
- Shows deployment commands for main/beta

## Creating Your Own Skills

1. Create a new `.md` file in `.claudeskills/`
2. Write instructions for Claude
3. Invoke with `/skillname` (filename without .md)

Example:
```bash
# Create skill file
touch .claudeskills/my-skill.md

# Invoke it
/my-skill
```

## Usage

```bash
# In Claude Code conversation:
/review-css src/assets/css/global.css
/new-page about-me
/deploy
```

Skills can accept arguments - Claude will use them as context.
