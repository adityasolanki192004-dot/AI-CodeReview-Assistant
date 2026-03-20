import logging

# Initialize logger
logger = logging.getLogger(__name__)

def parse_diff(diff_text):
    files = {}
    current_file = None
    
    if not diff_text:
        logger.warning("No diff text provided to parse_diff.")
        return {}

    lines = diff_text.split("\n")
    logger.info(f"Parsing diff: {len(lines)} lines detected.")

    for line in lines:
        if line.startswith("diff --git"):
            parts = line.split(" ")
            if len(parts) > 2:
                # Use the 'b' path as the file identifier
                # Handle cases where path might be prefixed with b/
                raw_path = parts[3]
                current_file = raw_path[2:] if raw_path.startswith("b/") else raw_path
                
                files[current_file] = []
                logger.debug(f"Found modified file: {current_file}")
                
        elif current_file:
            # Skip the '---' and '+++' headers in the diff
            if line.startswith("+++") or line.startswith("---"):
                continue
                
            if line.startswith("+") or line.startswith("-"):
                files[current_file].append(line)

    # Summary Log
    detected_files = list(files.keys())
    logger.info(f"Diff parsing complete. Files identified: {len(detected_files)}")
    if detected_files:
        logger.debug(f"Files list: {detected_files}")
    else:
        logger.warning("Diff parser found 0 files. Check if the diff format is standard git.")

    return files