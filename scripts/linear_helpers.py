import argparse
import json
import os
import sys
import urllib.error
import urllib.request
from typing import Any, Dict, Optional


def gql(query: str, api_key: str, variables: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
    payload: Dict[str, Any] = {"query": query}
    if variables is not None:
        payload["variables"] = variables

    request = urllib.request.Request(
        "https://api.linear.app/graphql",
        data=json.dumps(payload).encode("utf-8"),
        headers={
            "Authorization": api_key,
            "Content-Type": "application/json",
        },
        method="POST",
    )

    try:
        with urllib.request.urlopen(request, timeout=30) as response:
            return json.loads(response.read().decode("utf-8"))
    except urllib.error.HTTPError as exc:
        body = exc.read().decode("utf-8", errors="replace")
        raise RuntimeError(f"Linear API request failed ({exc.code}): {body}") from exc


def resolve_linear_id(kind: str, api_key: str, lookup_value: str, field_name: str) -> str:
    response = gql(f"{{ {kind}s {{ nodes {{ id {field_name} }} }} }}", api_key)
    nodes = response["data"][f"{kind}s"]["nodes"]
    match = next((node["id"] for node in nodes if str(node.get(field_name, "")).lower() == lookup_value.lower()), None)
    if match is None:
        raise SystemExit(f"ERROR: {lookup_value} not found in Linear {kind} list.")
    return match


def create_linear_issue(
    api_key: str,
    team_key: str,
    project_name: str,
    title: str,
    description: str,
    fail_on_error: bool = True,
) -> Optional[Dict[str, Any]]:
    team_id = resolve_linear_id("team", api_key, team_key, "key")
    project_id = resolve_linear_id("project", api_key, project_name, "name")

    issue_response = gql(
        """
        mutation CreateIssue($teamId: String!, $projectId: String, $title: String!, $description: String) {
          issueCreate(input: { teamId: $teamId, projectId: $projectId, title: $title, description: $description }) {
            success
            issue {
              id
              identifier
              url
            }
          }
        }
        """,
        api_key,
        {
            "teamId": team_id,
            "projectId": project_id,
            "title": title,
            "description": description,
        },
    )

    issue_create = issue_response["data"]["issueCreate"]
    if not issue_create.get("success"):
        message = f"Linear issue creation failed: {issue_create}"
        if fail_on_error:
            raise SystemExit(message)
        print(f"Warning: {message}", file=sys.stderr)
        return None

    return issue_create["issue"]


def _parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Linear helper utilities")
    subparsers = parser.add_subparsers(dest="command", required=True)

    team = subparsers.add_parser("resolve-team-id", help="Resolve a Linear team key to an ID")
    team.add_argument("--api-key", default=os.environ.get("LINEAR_API_KEY"))
    team.add_argument("--team-key", required=True)

    project = subparsers.add_parser("resolve-project-id", help="Resolve a Linear project name to an ID")
    project.add_argument("--api-key", default=os.environ.get("LINEAR_API_KEY"))
    project.add_argument("--project-name", required=True)

    issue = subparsers.add_parser("create-issue", help="Create a Linear issue")
    issue.add_argument("--api-key", default=os.environ.get("LINEAR_API_KEY"))
    issue.add_argument("--team-key", required=True)
    issue.add_argument("--project-name", required=True)
    issue.add_argument("--title", required=True)
    issue.add_argument("--description", required=True)
    issue.add_argument("--fail-on-error", action="store_true")

    return parser.parse_args()


def main() -> int:
    args = _parse_args()
    if args.command == "resolve-team-id":
        print(resolve_linear_id("team", args.api_key, args.team_key, "key"))
        return 0
    if args.command == "resolve-project-id":
        print(resolve_linear_id("project", args.api_key, args.project_name, "name"))
        return 0
    if args.command == "create-issue":
        issue = create_linear_issue(
            args.api_key,
            args.team_key,
            args.project_name,
            args.title,
            args.description,
            fail_on_error=args.fail_on_error,
        )
        if issue is None:
            return 0
        print(json.dumps(issue))
        return 0
    raise SystemExit(f"Unsupported command: {args.command}")


if __name__ == "__main__":
    sys.exit(main())
