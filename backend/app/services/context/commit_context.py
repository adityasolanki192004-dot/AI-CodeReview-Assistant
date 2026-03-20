def get_last_k(commits, k=5):
    if not isinstance(commits, list):
        return []
    # Fixed the slicing crash
    return commits[:min(len(commits), k)]