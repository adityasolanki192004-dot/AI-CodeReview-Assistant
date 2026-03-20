import requests
import logging

logger = logging.getLogger(__name__)

def get_diff(repo_slug, pr_number, token=None):
    """Fetches the raw diff text from GitHub API."""
    url = f"https://api.github.com/repos/{repo_slug}/pulls/{pr_number}"
    headers = {
        "Accept": "application/vnd.github.v3.diff", # Crucial for raw text
    }
    if token:
        headers["Authorization"] = f"token {token}"

    try:
        response = requests.get(url, headers=headers, timeout=15)
        if response.status_code == 200:
            return response.text
        logger.error(f"GitHub API Error: {response.status_code} - {response.text}")
        return ""
    except Exception as e:
        logger.error(f"Failed to fetch diff: {str(e)}")
        return ""