---
name: azure-functions-feedback
description: "Turn session findings into previewed GitHub issues for the azure-functions plugin"
---

> **Language**: Always respond in the same language the user is using.

# azure-functions-feedback — Azure Functions Skills Feedback

Use this skill after an Azure Functions skill workflow when the session reveals an improvement opportunity for the `azure-functions-*` skills, their references, or the plugin README.

## When to use

Use this skill when:

- The user asks to send feedback or create an issue for Azure Functions Skills.
- A workflow uncovered confusing guidance, missing verification, outdated commands, wrong MCP tool usage, repeated recovery steps, or missing diagnostics evidence.
- The agent needed user correction about an `azure-functions-*` skill.
- A manual or E2E test produced reusable findings.

Do not use it for ordinary app bugs unless the finding is about the skill suite itself.

## Workflow

### 1. Review the session

Review the available conversation/session history, files changed, test output, and command results. Identify only actionable feedback related to the azure-functions plugin:

- affected skill or file (`azure-functions-create`, `azure-functions-deploy`, README, routing, references, etc.)
- observed behavior
- expected behavior
- evidence from the session
- repro steps or scenario
- proposed fix or documentation change
- risk / impact

Redact secrets, tenant-specific sensitive data, function keys, publish profiles, tokens, connection strings, and customer data. Keep only resource names or URLs that the user explicitly allows to share.

### 2. Ask whether to proceed

If feedback is likely useful, ask the user whether they want to provide it. Keep the prompt concise:

> I found feedback that could improve Azure Functions Skills. Would you like to preview it as an Issue?

Options:

- Issue
- Not now

Do not create external GitHub artifacts without explicit user confirmation.

### 3. Prepare a preview

Before creating anything, show a preview with this structure:

```
Title:
Summary:
Affected area:
Evidence:
Repro / scenario:
Expected behavior:
Proposed change:
Validation plan:
Redactions applied:
```

Ask the user to approve or edit the preview.

### 4. Issue path

After approval, search existing issues in `microsoft/azure-dev-tools` before creating a new issue. Look for the preview title, affected area, and key symptom terms. Include both open and recently closed issues when the GitHub CLI or web UI supports it.

If an existing issue is the same topic, or is not identical but clearly similar enough to continue the conversation there, do not create a duplicate issue. Add a short comment with the new evidence or scenario instead. Report the existing issue URL to the user and explain that the feedback was added there.

If no similar issue exists, create a new issue in `microsoft/azure-dev-tools` using the preview content. Start the title with `[azure-functions]` so that maintainers can find the plugin feedback.

Prefer the GitHub CLI when available. If it is unavailable, provide the prepared issue or comment body and ask the user to create or post it manually.

After creating an issue or adding a comment, report the issue URL and any follow-up action.

### 5. Proposed changes

The public repository contains the published plugin package, not its maintained source. Do not open a pull request that changes the published package. If the user wants to propose a specific change, put the proposed text or a unified diff in the issue body under **Proposed change**.

Do not include unrelated local docs, PLAN files, secrets, generated temp files, or user-specific logs.

### 6. Output

End with:

- Issue URL, if created or updated.
- Any intentionally skipped feedback.

## Quality bar

- Feedback must be specific, actionable, and grounded in observed evidence.
- Prefer one issue per cohesive topic.
- Do not overgeneralize from a single failure unless the skill guidance caused or failed to recover from it.
- Keep user language and tone.
