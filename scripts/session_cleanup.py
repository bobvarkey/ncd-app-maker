#!/usr/bin/env python3
"""
Session Cleanup - Nightly maintenance script
Cleans up stale session files from OpenClaw agents.
- Delete tombstones (.reset.*, .bak-*)
- Remove cron session files older than 7 days
- Delete orphaned cron entries
- Never touch main sessions or non-cron sessions under 30 days
Idempotent. Creates backup before writing.
"""

import json
import os
import shutil
import subprocess
from datetime import datetime, timedelta
from pathlib import Path

AGENTS_DIR = Path.home() / ".openclaw" / "agents"
CLAW_DIR = Path.home() / ".openclaw"
BACKUP_DIR = Path.home() / ".openclaw" / "backups"
DAYS_OLD_CRON = 7
DAYS_OLD_SESSION = 30

def get_cron_session_ids() -> set:
    """Get list of session IDs that are in cron jobs."""
    cron_sessions = set()
    try:
        result = subprocess.run(
            ["openclaw", "cron", "list", "--include-disabled"],
            capture_output=True,
            text=True,
            timeout=30
        )
        # Parse cron jobs to find session targets
        for line in result.stdout.splitlines():
            if "session-" in line.lower() or "cron" in line.lower():
                # Extract session IDs
                import re
                ids = re.findall(r'session[:-]?([a-zA-Z0-9-]+)', line, re.IGNORECASE)
                for sid in ids:
                    cron_sessions.add(sid)
    except Exception as e:
        print(f"  Warning: Could not fetch cron jobs: {e}")
    return cron_sessions

def discover_agents() -> list[Path]:
    """Discover all agent directories."""
    agents = []
    if AGENTS_DIR.exists():
        for item in AGENTS_DIR.iterdir():
            if item.is_dir():
                agents.append(item)
    return agents

def cleanup_agent(agent_dir: Path, cron_sessions: set, dry_run: bool = True, backup_dir: Path = None) -> dict:
    """Clean up stale files for a single agent."""
    stats = {"tombstones": 0, "cron_files": 0, "orphaned": 0, "skipped": 0}
    
    sessions_dir = agent_dir / "sessions"
    if not sessions_dir.exists():
        return stats
    
    now = datetime.now()
    cutoff_cron = now - timedelta(days=DAYS_OLD_CRON)
    cutoff_session = now - timedelta(days=DAYS_OLD_SESSION)
    
    # Find all session directories
    for session_dir in sessions_dir.iterdir():
        if not session_dir.is_dir():
            continue
        
        session_name = session_dir.name
        is_main = "main" in session_name.lower()
        
        # Check modification time
        mtime = datetime.fromtimestamp(session_dir.stat().st_mtime)
        
        # Check if it's a cron session
        is_cron = any(cs in session_name for cs in cron_sessions) or "cron" in session_name.lower()
        
        # 1. Delete tombstones
        for item in session_dir.glob(".*reset*"):
            if dry_run:
                print(f"  [DRY-RUN] Would delete tombstone {item.name}")
                stats["tombstones"] += 1
            else:
                if backup_dir:
                    backup_file(backup_dir / "tombstones" / agent_dir.name, item)
                item.unlink()
                stats["tombstones"] += 1
        
        for item in session_dir.glob(".bak-*"):
            if dry_run:
                print(f"  [DRY-RUN] Would delete backup {item.name}")
                stats["tombstones"] += 1
            else:
                if backup_dir:
                    backup_file(backup_dir / "bak" / agent_dir.name, item)
                item.unlink()
                stats["tombstones"] += 1
        
        # 2. Handle cron session files older than 7 days
        if is_cron and mtime < cutoff_cron:
            if dry_run:
                print(f"  [DRY-RUN] Would delete cron session {session_name} (older than {DAYS_OLD_CRON} days)")
                stats["cron_files"] += 1
            else:
                if backup_dir:
                    backup_file(backup_dir / "cron_sessions" / agent_dir.name, session_dir, is_dir=True)
                shutil.rmtree(session_dir)
                stats["cron_files"] += 1
        
        # 3. Skip main sessions or recent sessions
        elif is_main or mtime > cutoff_session:
            stats["skipped"] += 1
            continue
        
        # 4. Orphaned cron sessions (not in cron but look like cron)
        elif "session-" in session_name and mtime < cutoff_cron:
            # Double check - if not in current cron list, it's orphaned
            if session_name not in cron_sessions:
                if dry_run:
                    print(f"  [DRY-RUN] Would delete orphaned session {session_name}")
                    stats["orphaned"] += 1
                else:
                    if backup_dir:
                        backup_file(backup_dir / "orphaned" / agent_dir.name, session_dir, is_dir=True)
                    shutil.rmtree(session_dir)
                    stats["orphaned"] += 1
            else:
                stats["skipped"] += 1
        else:
            stats["skipped"] += 1
    
    return stats

def backup_file(dest_dir: Path, src: Path, is_dir: bool = False):
    """Backup file/folder before deletion."""
    dest_dir.mkdir(parents=True, exist_ok=True)
    dest = dest_dir / src.name
    if dest.exists():
        dest = dest_dir / f"{src.name}_{datetime.now().strftime('%Y%m%d%H%M%S')}"
    if is_dir:
        shutil.copytree(src, dest, dirs_exist_ok=True)
    else:
        shutil.copy2(src, dest)

def cleanup_sessions(dry_run: bool = True) -> dict:
    """Main cleanup function."""
    print("[Session Cleanup] Discovering agents...")
    
    # Get cron session IDs
    cron_sessions = get_cron_session_ids()
    print(f"  Found {len(cron_sessions)} cron session patterns")
    
    # Setup backup dir
    backup_dir = None
    if not dry_run:
        backup_dir = BACKUP_DIR / datetime.now().strftime("%Y%m%d_%H%M%S")
        backup_dir.mkdir(parents=True, exist_ok=True)
        print(f"  Backup directory: {backup_dir}")
    
    total_stats = {"tombstones": 0, "cron_files": 0, "orphaned": 0, "skipped": 0}
    
    agents = discover_agents()
    print(f"  Found {len(agents)} agents")
    
    for agent in agents:
        print(f"  Processing {agent.name}...")
        stats = cleanup_agent(agent, cron_sessions, dry_run, backup_dir)
        for k, v in stats.items():
            total_stats[k] += v
    
    return total_stats

if __name__ == "__main__":
    import sys
    
    dry_run = "--dry-run" in sys.argv or "-n" in sys.argv
    
    if dry_run:
        print("[Session Cleanup] DRY RUN MODE\n")
    else:
        print("[Session Cleanup] Running...\n")
    
    stats = cleanup_sessions(dry_run=dry_run)
    print(f"\nSummary: {stats['tombstones']} tombstones, {stats['cron_files']} cron files, {stats['orphaned']} orphaned, {stats['skipped']} skipped")
