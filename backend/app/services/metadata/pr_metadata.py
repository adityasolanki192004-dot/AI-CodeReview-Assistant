def extract_metadata(pr):
    return {
        "title": pr.get("title"),
        "description": pr.get("body"),
        "author": pr.get("user", {}).get("login"),
    }