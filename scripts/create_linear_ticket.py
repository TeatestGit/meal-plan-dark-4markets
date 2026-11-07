"""Called by .github/workflows/linear-pr-ticket.yml on PR open/reopen."""
import json
import os
import sys
import urllib.error
import urllib.request

from scripts.linear_helpers import create_linear_issue, plain_english_summary

pr_title = os.environ["PR_TITLE"]
pr_body = os.environ.get("PR_BODY", "")
pr_number = os.environ["PR_NUMBER"]
pr_url = os.environ["PR_URL"]
linear_api_key = os.environ["LINEAR_API_KEY"]
git_auth = os.environ["GIT_AUTH"]
repo = os.environ["REPO"]

# On reopen, skip if a Linear comment already exists on this PR
comments_req = urllib.request.Request(
    f"https://api.github.com/repos/{repo}/issues/{pr_number}/comments",
    headers={"Authorization": f"Bearer {git_auth}", "Accept": "application/vnd.github+json"},
)
with urllib.request.urlopen(comments_req, timeout=30) as r:
    existing = json.loads(r.read())
if any("Linear issue created" in (c.get("body") or "") for c in existing):
    print("Linear issue already exists for this PR, skipping.")
    sys.exit(0)

plain_summary = plain_english_summary(
    os.environ.get("ANTHROPIC_API_KEY", ""),
    pr_title,
    pr_body,
)

safe_body = pr_body.replace("```", "'''") if pr_body else "_No description provided._"

description = f"""## What this change does
{plain_summary}

## Technical details
| | |
|---|---|
| **PR** | [#{pr_number}]({pr_url}) |
| **Author** | {os.environ["PR_AUTHOR"]} |
| **Branch** | `{os.environ["PR_BRANCH"]}` → `{os.environ["PR_BASE"]}` |
| **Files changed** | {os.environ["PR_FILES"]} (+{os.environ["PR_ADDITIONS"]} / -{os.environ["PR_DELETIONS"]}) |
| **Commits** | {os.environ["PR_COMMITS"]} |

## PR description
{safe_body}"""

issue = create_linear_issue(
    linear_api_key,
    os.environ["LINEAR_PROJECT_NAME"],
    pr_title,
    description,
    fail_on_error=True,
)

if issue is None:
    sys.exit(0)

issue_id = issue["identifier"]
issue_url = issue["url"]

comment_payload = json.dumps({"body": f"🔗 Linear issue created: [{issue_id}]({issue_url})"}).encode("utf-8")
comment_request = urllib.request.Request(
    f"https://api.github.com/repos/{repo}/issues/{pr_number}/comments",
    data=comment_payload,
    headers={
        "Authorization": f"Bearer {git_auth}",
        "Accept": "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
        "Content-Type": "application/json",
    },
    method="POST",
)

try:
    with urllib.request.urlopen(comment_request, timeout=30) as response:
        print(f"GitHub comment created: {response.status}")
except urllib.error.HTTPError as exc:
    body = exc.read().decode("utf-8", errors="replace")
    print(f"Warning: GitHub PR comment failed ({exc.code}): {body}", file=sys.stderr)
