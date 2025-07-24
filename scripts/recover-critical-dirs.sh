#!/bin/bash

# Recovery script for critical directories
# This script can restore critical directories from backups or git history

set -e

# Configuration
BACKUP_DIR=".backups"
CRITICAL_DIRS=".cursor/rules/audits .cursor/rules/features .cursor/rules/tests"

echo "🔄 Critical Directory Recovery Script"
echo "====================================="

# Function to restore from backup
restore_from_backup() {
    local dir=$1
    local backup_pattern="${dir//\//_}_*.tar.gz"
    
    echo "Looking for backup of $dir..."
    
    # Find the most recent backup
    latest_backup=$(ls -t "$BACKUP_DIR"/$backup_pattern 2>/dev/null | head -1)
    
    if [ -n "$latest_backup" ]; then
        echo "Found backup: $latest_backup"
        echo "Restoring $dir from backup..."
        
        # Remove existing directory if it exists
        if [ -d "$dir" ]; then
            rm -rf "$dir"
        fi
        
        # Extract backup
        tar -xzf "$latest_backup" -C .
        echo "✅ Successfully restored $dir from backup"
        return 0
    else
        echo "❌ No backup found for $dir"
        return 1
    fi
}

# Function to restore from git history
restore_from_git() {
    local dir=$1
    echo "Attempting to restore $dir from git history..."
    
    # Find the last commit that had this directory
    last_commit=$(git log --oneline --name-status --all | grep -B 1 "$dir" | head -1 | awk '{print $1}')
    
    if [ -n "$last_commit" ]; then
        echo "Found in commit: $last_commit"
        echo "Restoring $dir from git history..."
        
        # Checkout the directory from that commit
        git checkout "$last_commit" -- "$dir"
        echo "✅ Successfully restored $dir from git history"
        return 0
    else
        echo "❌ Could not find $dir in git history"
        return 1
    fi
}

# Main recovery logic
echo "Checking for missing critical directories..."

for dir in $CRITICAL_DIRS; do
    if [ ! -d "$dir" ]; then
        echo "❌ Missing directory: $dir"
        echo "Attempting recovery..."
        
        # Try backup first
        if restore_from_backup "$dir"; then
            continue
        fi
        
        # Try git history if backup failed
        if restore_from_git "$dir"; then
            continue
        fi
        
        echo "❌ Failed to recover $dir"
    else
        echo "✅ Directory exists: $dir"
    fi
done

echo ""
echo "Recovery process completed!"
echo "Please check the restored directories and commit any changes." 