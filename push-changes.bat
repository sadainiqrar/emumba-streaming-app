@echo off
echo Pushing changes to a new branch...

REM Set the branch name
set BRANCH_NAME=fix-auth-issues

REM Check if git is installed
where git >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo Git is not installed or not in the PATH.
    echo Please install Git or add it to your PATH.
    pause
    exit /b 1
)

REM Create a new branch
echo Creating new branch: %BRANCH_NAME%
git checkout -b %BRANCH_NAME%
if %ERRORLEVEL% NEQ 0 (
    echo Failed to create new branch.
    pause
    exit /b 1
)

REM Add all changes
echo Adding all changes...
git add .
if %ERRORLEVEL% NEQ 0 (
    echo Failed to add changes.
    pause
    exit /b 1
)

REM Commit the changes
echo Committing changes...
git commit -m "Fix authentication issues and improve error handling"
if %ERRORLEVEL% NEQ 0 (
    echo Failed to commit changes.
    pause
    exit /b 1
)

REM Push the branch to the remote repository
echo Pushing branch to remote repository...
git push -u origin %BRANCH_NAME%
if %ERRORLEVEL% NEQ 0 (
    echo Failed to push branch to remote repository.
    pause
    exit /b 1
)

echo Changes successfully pushed to branch: %BRANCH_NAME%
pause
