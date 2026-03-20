import ast
import os

def scan_single_file_ast(repo_path, rel_path):
    findings = []
    full_path = os.path.join(repo_path, rel_path)
    
    if not rel_path.endswith(".py") or not os.path.exists(full_path):
        return []

    try:
        with open(full_path, "r", encoding="utf-8") as file:
            tree = ast.parse(file.read())
        
        for node in ast.walk(tree):
            if isinstance(node, ast.Call):
                func_name = ""
                if isinstance(node.func, ast.Name):
                    func_name = node.func.id
                
                if func_name in ["eval", "exec"]:
                    findings.append({
                        "file": rel_path,
                        "line": node.lineno,
                        "message": f"Dangerous function '{func_name}' detected.",
                        "severity": "HIGH",
                        "tool": "python-ast"
                    })
    except Exception:
        pass
    return findings

def scan_python_ast(path):
    findings = []
    
    for root, _, files in os.walk(path):
        for f in files:
            if f.endswith(".py"):
                full_path = os.path.join(root, f)
                relative_path = os.path.relpath(full_path, path)
                try:
                    with open(full_path, "r", encoding="utf-8") as file:
                        tree = ast.parse(file.read())
                    
                    for node in ast.walk(tree):
                        if isinstance(node, ast.Call):
                            func_name = ""
                            if isinstance(node.func, ast.Name):
                                func_name = node.func.id
                            
                            if func_name in ["eval", "exec"]:
                                findings.append({
                                    "file": relative_path,
                                    "line": node.lineno,
                                    "message": f"Dangerous function '{func_name}' can lead to Remote Code Execution.",
                                    "severity": "HIGH",
                                    "tool": "python-ast"
                                })
                except Exception:
                    continue
    return findings