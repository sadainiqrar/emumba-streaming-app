#!/bin/bash

# Set colors for better readability
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Set the branch name
BRANCH_NAME="fix-auth-issues"

echo -e "${GREEN}Pushing changes to a new branch: $BRANCH_NAME${NC}"

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo -e "${RED}Git is not installed or not in the PATH.${NC}"
    echo -e "${RED}Please install Git or add it to your PATH.${NC}"
    read -p "Press Enter to exit"
    exit 1
fi

# Create a new branch
echo -e "${GREEN}Creating new branch: $BRANCH_NAME${NC}"
git checkout -b $BRANCH_NAME
if [ $? -ne 0 ]; then
    echo -e "${RED}Failed to create new branch.${NC}"
    read -p "Press Enter to exit"
    exit 1
fi

# Add all changes
echo -e "${GREEN}Adding all changes...${NC}"
git add .
if [ $? -ne 0 ]; then
    echo -e "${RED}Failed to add changes.${NC}"
    read -p "Press Enter to exit"
    exit 1
fi

# Commit the changes
echo -e "${GREEN}Committing changes...${NC}"
git commit -m "Fix authentication issues and improve error handling"
if [ $? -ne 0 ]; then
    echo -e "${RED}Failed to commit changes.${NC}"
    read -p "Press Enter to exit"
    exit 1
fi

# Push the branch to the remote repository
echo -e "${GREEN}Pushing branch to remote repository...${NC}"
git push -u origin $BRANCH_NAME
if [ $? -ne 0 ]; then
    echo -e "${RED}Failed to push branch to remote repository.${NC}"
    read -p "Press Enter to exit"
    exit 1
fi

echo -e "${GREEN}Changes successfully pushed to branch: $BRANCH_NAME${NC}"
read -p "Press Enter to exit"
