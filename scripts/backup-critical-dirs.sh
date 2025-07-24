#!/bin/bash

# Backup script for critical directories
# This script creates backups of important directories before major operations

set -e

# Configuration
BACKUP_DIR=".backups"
CRITICAL_DIRS=".cursor/rules/audits .cursor/rules/features .cursor/rules/tests"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

echo "🔒 Creating backup of critical directories..."

# Backup each critical directory
for dir in $CRITICAL_DIRS; do
    if [ -d "$dir" ]; then
        backup_name="${dir//\//_}_${TIMESTAMP}.tar.gz"
        echo "Backing up $dir to $BACKUP_DIR/$backup_name"
        tar -czf "$BACKUP_DIR/$backup_name" "$dir"
    else
        echo "⚠️  Warning: Directory $dir does not exist"
    fi
done

# Create a comprehensive backup of all .cursor directories
if [ -d ".cursor" ]; then
    backup_name="cursor_rules_${TIMESTAMP}.tar.gz"
    echo "Backing up entire .cursor directory to $BACKUP_DIR/$backup_name"
    tar -czf "$BACKUP_DIR/$backup_name" ".cursor"
fi

echo "✅ Backup completed successfully"
echo "Backup files created in: $BACKUP_DIR"

# List backup files
echo "📁 Backup files:"
ls -la "$BACKUP_DIR"/*.tar.gz 2>/dev/null || echo "No backup files found" 