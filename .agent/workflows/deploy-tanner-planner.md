---
description: Deploy tanner-planner to GitHub
---

# Deploy Tanner Planner to GitHub

This workflow guides you through deploying the tanner-planner directory to its dedicated GitHub repository at https://github.com/cdlmba/TannerPlanner.

## Prerequisites
- Ensure you have Git installed and configured
- Ensure you have access to the GitHub repository https://github.com/cdlmba/TannerPlanner

## Steps

### 1. Navigate to the parent directory
```bash
cd "c:\Users\Test\OneDrive\Documents\1 Projects\104 Christopher Lynn Systems Website"
```

### 2. Remove tanner-planner from parent repository tracking
```bash
git rm -r --cached Apps/tanner-planner
```

### 3. Add tanner-planner to .gitignore in parent repository
Add the following line to the `.gitignore` file in the parent directory:
```
Apps/tanner-planner/
```

### 4. Commit the removal in parent repository
```bash
git add .gitignore
git commit -m "Remove tanner-planner from tracking - moved to separate repository"
```

### 5. Navigate to tanner-planner directory
```bash
cd "Apps\tanner-planner"
```

### 6. Initialize Git repository (if not already initialized)
```bash
git init
```

### 7. Add the GitHub remote
```bash
git remote add origin https://github.com/cdlmba/TannerPlanner.git
```

### 8. Stage all files
```bash
git add .
```

### 9. Create initial commit
```bash
git commit -m "Initial commit: Tanner Planner application"
```

### 10. Create and switch to main branch (if needed)
```bash
git branch -M main
```

### 11. Push to GitHub
```bash
git push -u origin main
```

## Verification
After completing these steps:
1. Visit https://github.com/cdlmba/TannerPlanner to verify the code is uploaded
2. Check that all files are present
3. Verify the README.md displays correctly

## Notes
- If the repository already has content, you may need to use `git pull origin main --allow-unrelated-histories` before pushing
- Make sure sensitive files (like .env.local) are listed in .gitignore before pushing
