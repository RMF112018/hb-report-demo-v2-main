# Critical Directories Safeguarding Guide

## Overview

This document outlines the procedures and tools implemented to safeguard critical directories in the HB Report Demo project, particularly the `.cursor/rules` directories that contain important documentation and audit files.

## Critical Directories

The following directories are considered critical and are protected from accidental deletion:

- `.cursor/rules/audits/` - Contains audit documentation files
- `.cursor/rules/features/` - Contains feature documentation files
- `.cursor/rules/tests/` - Contains test documentation files

## Safeguarding Measures Implemented

### 1. Git Configuration

**Updated `.gitignore`** to explicitly include critical directories:

```
# Explicitly include .cursor directories to prevent accidental deletion
!.cursor/
!.cursor/rules/
!.cursor/rules/audits/
!.cursor/rules/features/
!.cursor/rules/tests/
!.cursor/rules/**/*.mdc
```

### 2. Pre-commit Hook Protection

**File**: `.git/hooks/pre-commit`

This hook prevents accidental deletion of critical directories during commits. It will:

- Check if any critical directories are being deleted
- Block the commit if deletion is detected
- Provide clear error messages about what was blocked

### 3. Backup System

**File**: `scripts/backup-critical-dirs.sh`

This script creates timestamped backups of critical directories:

- Creates compressed backups in `.backups/` directory
- Uses timestamped filenames for version control
- Backs up individual directories and entire `.cursor` structure

**Usage**:

```bash
./scripts/backup-critical-dirs.sh
```

### 4. Recovery System

**File**: `scripts/recover-critical-dirs.sh`

This script can restore critical directories from:

- Local backups in `.backups/` directory
- Git history (previous commits)

**Usage**:

```bash
./scripts/recover-critical-dirs.sh
```

## Best Practices

### Before Major Operations

1. **Always create a backup**:

   ```bash
   ./scripts/backup-critical-dirs.sh
   ```

2. **Check git status** to ensure no unintended changes:

   ```bash
   git status
   ```

3. **Use explicit commits** when modifying critical directories:
   ```bash
   git add .cursor/rules/audits/
   git commit -m "Update audit documentation"
   ```

### During Development

1. **Avoid bulk deletions** that might affect critical directories
2. **Use the pre-commit hook** to catch accidental deletions
3. **Test changes** before pushing to ensure critical directories remain intact

### After Issues

1. **Run recovery script** if directories are missing:

   ```bash
   ./scripts/recover-critical-dirs.sh
   ```

2. **Check backups** if recovery from git fails:

   ```bash
   ls -la .backups/
   ```

3. **Verify restoration** by checking directory contents:
   ```bash
   ls -la .cursor/rules/
   ```

## Troubleshooting

### Pre-commit Hook Failing

If the pre-commit hook is blocking legitimate changes:

1. **Temporarily disable** (not recommended):

   ```bash
   mv .git/hooks/pre-commit .git/hooks/pre-commit.disabled
   ```

2. **Modify the hook** to allow specific changes
3. **Re-enable** after changes are complete

### Recovery Issues

If recovery scripts fail:

1. **Check git history** for the missing directories:

   ```bash
   git log --all --full-history -- .cursor/rules/
   ```

2. **Manual restoration** from specific commits:

   ```bash
   git checkout <commit-hash> -- .cursor/rules/audits/
   ```

3. **Contact team** if manual recovery is needed

## Monitoring

### Regular Checks

- **Weekly**: Run backup script to ensure current backups
- **Before releases**: Verify all critical directories exist
- **After merges**: Check that critical directories weren't affected

### Automated Monitoring

Consider implementing:

- CI/CD checks for critical directory existence
- Automated backup scheduling
- Alert system for missing critical directories

## Emergency Procedures

### Immediate Response

1. **Stop all operations** that might affect critical directories
2. **Run recovery script** immediately
3. **Verify restoration** before continuing
4. **Create new backup** after restoration

### If Recovery Fails

1. **Check all backups** in `.backups/` directory
2. **Search git history** for the missing files
3. **Contact team lead** for manual restoration
4. **Document the incident** for future prevention

## Contact Information

For issues with critical directory safeguarding:

- **Team Lead**: [Contact Information]
- **Backup Location**: `.backups/` directory
- **Recovery Scripts**: `scripts/` directory

---

**Last Updated**: [Current Date]
**Version**: 1.0
