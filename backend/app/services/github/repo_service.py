from git import Repo
import tempfile

def clone_repo(repo_url: str):
    try:
        if not repo_url.endswith(".git"):
            repo_url += ".git"
        temp_dir = tempfile.mkdtemp(prefix="repo_")
        Repo.clone_from(repo_url, temp_dir)
        return temp_dir

    except Exception as e:
        print("CLONE ERROR:", e)
        raise