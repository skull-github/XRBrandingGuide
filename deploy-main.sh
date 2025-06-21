#!/bin/bash

# MLB XR Branding Guide - Main Branch Deployment Script
# Quick deployment to main branch (DEFAULT WORKING BRANCH)
# WORKFLOW: Develop on MAIN → Push to origin/main (this script) → Deploy to STABLE (secure script)

set -e  # Exit on any error

# Configuration
MAIN_BRANCH="main"
REMOTE="origin"

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}🏗️  MLB XR Branding Guide - Main Branch Deployment${NC}"
echo -e "${BLUE}===============================================${NC}"
echo -e "${GREEN}📋 DEFAULT WORKING BRANCH: Develop here, push here${NC}"
echo ""

# Get current branch
CURRENT_BRANCH=$(git branch --show-current)

# Show current status
echo -e "${YELLOW}📊 Current Status:${NC}"
echo -e "   Current branch: ${BLUE}$CURRENT_BRANCH${NC}"
echo -e "   Target branch:  ${BLUE}$MAIN_BRANCH${NC}"
echo -e "   Remote:         ${BLUE}$REMOTE${NC}"
echo ""

# Store current branch to return to it later
ORIGINAL_BRANCH="$CURRENT_BRANCH"

# Switch to main branch if not already there
if [ "$CURRENT_BRANCH" != "$MAIN_BRANCH" ]; then
    echo -e "${BLUE}📂 Switching to $MAIN_BRANCH branch...${NC}"
    git checkout $MAIN_BRANCH
    
    echo -e "${BLUE}🔄 Merging changes from $ORIGINAL_BRANCH...${NC}"
    git merge $ORIGINAL_BRANCH --no-edit
fi

# Push to remote
echo -e "${BLUE}📤 Pushing to $REMOTE/$MAIN_BRANCH...${NC}"
git push $REMOTE $MAIN_BRANCH

# Return to original branch if we switched
if [ "$ORIGINAL_BRANCH" != "$MAIN_BRANCH" ]; then
    echo -e "${BLUE}🔙 Returning to $ORIGINAL_BRANCH branch...${NC}"
    git checkout $ORIGINAL_BRANCH
fi

echo ""
echo -e "${GREEN}✅ MAIN DEPLOYMENT SUCCESSFUL${NC}"
echo -e "${GREEN}=============================${NC}"
echo -e "${GREEN}✅ Changes have been successfully deployed to $REMOTE/$MAIN_BRANCH${NC}"
echo ""
echo -e "${BLUE}🎉 MLB XR Branding Guide main deployment complete!${NC}"
