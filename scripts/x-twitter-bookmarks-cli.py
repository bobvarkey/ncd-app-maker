#!/usr/bin/env python3
import argparse
import subprocess
import os

DEFAULT_DB = os.environ.get("TW_BOOKMARK_MEM_DB", "/Users/bobvarkey/.openclaw/workspace/memory_bookmarks.db")
SCRIPT = os.path.expanduser("~/.openclaw/workspace/tests/x-twitter-bookmarks-memory_test.py")

def run_python_script(db_path=None):
    env = os.environ.copy()
    if db_path:
        env["TW_BOOKMARK_MEM_DB"] = db_path
    cmd = ["python3", SCRIPT]
    proc = subprocess.Popen(cmd, env=env)
    proc.wait()
    return proc.returncode

def main():
    parser = argparse.ArgumentParser(description="CLI wrapper to run x-twitter-bookmarks-memory automation")
    parser.add_argument("--db", help="Path to memory DB (default: " + DEFAULT_DB + ")")
    args = parser.parse_args()

    code = run_python_script(args.db or DEFAULT_DB)
    if code == 0:
        print("x-twitter-bookmarks-memory automation completed successfully.")
    else:
        print("x-twitter-bookmarks-memory automation failed with code", code)
    return code

if __name__ == "__main__":
    raise SystemExit(main())
