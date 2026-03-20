from app.services.github.repo_service import clone_repo
from app.services.github.pr_service import get_pr
from app.services.github.commit_service import get_commits
from app.services.github.diff_service import get_diff
from app.services.context.context_builder import build_repo_context
from app.services.metadata.pr_metadata import extract_metadata

def run_pipeline(repo_url, repo_slug, pr_number, token):
    # 1. Clone
    print(f"STEP 1: Cloning repository {repo_slug}#{pr_number}...")
    repo_path = clone_repo(repo_url)

    # 2. Fetch GitHub Data
    print(f"STEP 2: Fetching PR data for {repo_slug}#{pr_number}...")
    pr_data = get_pr(repo_slug, pr_number, token)
    commits = get_commits(repo_slug, pr_number, token)
    diff_text = get_diff(repo_slug, pr_number, token)

    # 3. Build Context
    print(f"STEP 3: Building context for repository {repo_slug}#{pr_number}...")
    metadata = extract_metadata(pr_data)
    context = build_repo_context(repo_path, diff_text, commits)

    return {
        "repo_path": repo_path,
        "metadata": metadata,
        "context": context
    }