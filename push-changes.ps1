# Push changes to a new branch
Write-Host "Pushing changes to a new branch..." -ForegroundColor Green

# Set the branch name
$BRANCH_NAME = "fix-auth-issues"

# Check if git is installed
try {
    $gitVersion = git --version
    Write-Host "Git is installed: $gitVersion" -ForegroundColor Green
} catch {
    Write-Host "Git is not installed or not in the PATH." -ForegroundColor Red
    Write-Host "Please install Git or add it to your PATH." -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

# Create a new branch
Write-Host "Creating new branch: $BRANCH_NAME" -ForegroundColor Green
git checkout -b $BRANCH_NAME
if ($LASTEXITCODE -ne 0) {
    Write-Host "Failed to create new branch." -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

# Add all changes
Write-Host "Adding all changes..." -ForegroundColor Green
git add .
if ($LASTEXITCODE -ne 0) {
    Write-Host "Failed to add changes." -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

# Commit the changes
Write-Host "Committing changes..." -ForegroundColor Green
git commit -m "Fix authentication issues and improve error handling"
if ($LASTEXITCODE -ne 0) {
    Write-Host "Failed to commit changes." -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

# Push the branch to the remote repository
Write-Host "Pushing branch to remote repository..." -ForegroundColor Green
git push -u origin $BRANCH_NAME
if ($LASTEXITCODE -ne 0) {
    Write-Host "Failed to push branch to remote repository." -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host "Changes successfully pushed to branch: $BRANCH_NAME" -ForegroundColor Green
Read-Host "Press Enter to exit"
