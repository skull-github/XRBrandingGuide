#!/bin/bash

# MLB XR Branding Guide - Secure Stable Branch Deployment Script
# This script provides password protection before pushing to the stable branch

set -e  # Exit on any error

# Configuration
REQUIRED_PASSWORD="3333"
STABLE_BRANCH="stable"
REMOTE="origin"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🏗️  MLB XR Branding Guide - Stable Deployment${NC}"
echo -e "${BLUE}===============================================${NC}"
echo ""

# Check if we're in a git repository
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    echo -e "${RED}❌ Error: Not in a git repository${NC}"
    exit 1
fi

# Check if stable branch exists
if ! git show-ref --verify --quiet refs/heads/$STABLE_BRANCH; then
    echo -e "${RED}❌ Error: '$STABLE_BRANCH' branch does not exist${NC}"
    exit 1
fi

# Get current branch
CURRENT_BRANCH=$(git branch --show-current)

# Show current status
echo -e "${YELLOW}📊 Current Status:${NC}"
echo -e "   Current branch: ${BLUE}$CURRENT_BRANCH${NC}"
echo -e "   Target branch:  ${BLUE}$STABLE_BRANCH${NC}"
echo -e "   Remote:         ${BLUE}$REMOTE${NC}"
echo ""

# Check for uncommitted changes
if ! git diff-index --quiet HEAD --; then
    echo -e "${YELLOW}⚠️  Warning: You have uncommitted changes${NC}"
    echo -e "${YELLOW}   Please commit or stash your changes before deploying${NC}"
    echo ""
    git status --short
    echo ""
    read -p "Do you want to continue anyway? (y/N): " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo -e "${RED}❌ Deployment cancelled${NC}"
        exit 1
    fi
fi

# Show what will be deployed
echo -e "${YELLOW}📦 Deployment Preview:${NC}"
if [ "$CURRENT_BRANCH" != "$STABLE_BRANCH" ]; then
    echo -e "   Will switch to ${BLUE}$STABLE_BRANCH${NC} branch"
    echo -e "   Will merge changes from ${BLUE}$CURRENT_BRANCH${NC}"
else
    echo -e "   Already on ${BLUE}$STABLE_BRANCH${NC} branch"
fi
echo -e "   Will push to ${BLUE}$REMOTE/$STABLE_BRANCH${NC}"
echo ""

# Get recent commits to show what's being deployed
echo -e "${YELLOW}📝 Recent commits to be deployed:${NC}"
git log --oneline -5 --decorate --color=always
echo ""

# Security: Request password
echo -e "${RED}🔐 SECURITY CHECK${NC}"
echo -e "${RED}==================${NC}"
echo -e "${YELLOW}This operation will deploy to the STABLE branch.${NC}"
echo -e "${YELLOW}Please enter the deployment password to continue:${NC}"
echo ""

# Read password securely (hide input)
read -s -p "Password: " entered_password
echo ""
echo ""

# Verify password
if [ "$entered_password" != "$REQUIRED_PASSWORD" ]; then
    echo -e "${RED}❌ INCORRECT PASSWORD${NC}"
    echo -e "${RED}   Deployment cancelled for security reasons${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Password verified${NC}"
echo ""

# Final confirmation
echo -e "${YELLOW}⚠️  FINAL CONFIRMATION${NC}"
echo -e "${YELLOW}======================${NC}"
echo -e "${RED}You are about to deploy to the STABLE branch.${NC}"
echo -e "${RED}This action cannot be easily undone.${NC}"
echo ""
read -p "Are you absolutely sure you want to continue? (yes/no): " final_confirm

if [ "$final_confirm" != "yes" ]; then
    echo -e "${RED}❌ Deployment cancelled${NC}"
    exit 1
fi

echo ""
echo -e "${BLUE}🚀 Starting deployment...${NC}"
echo ""

# Store current branch to return to it later
ORIGINAL_BRANCH="$CURRENT_BRANCH"

# Switch to stable branch if not already there
if [ "$CURRENT_BRANCH" != "$STABLE_BRANCH" ]; then
    echo -e "${BLUE}📂 Switching to $STABLE_BRANCH branch...${NC}"
    git checkout $STABLE_BRANCH
    
    echo -e "${BLUE}🔄 Merging changes from $ORIGINAL_BRANCH...${NC}"
    git merge $ORIGINAL_BRANCH --no-edit
fi

# Push to remote
echo -e "${BLUE}📤 Pushing to $REMOTE/$STABLE_BRANCH...${NC}"
git push $REMOTE $STABLE_BRANCH

# Return to original branch if we switched
if [ "$ORIGINAL_BRANCH" != "$STABLE_BRANCH" ]; then
    echo -e "${BLUE}🔙 Returning to $ORIGINAL_BRANCH branch...${NC}"
    git checkout $ORIGINAL_BRANCH
fi

echo ""
echo -e "${GREEN}✅ DEPLOYMENT SUCCESSFUL${NC}"
echo -e "${GREEN}========================${NC}"
echo -e "${GREEN}✅ Changes have been successfully deployed to $REMOTE/$STABLE_BRANCH${NC}"
echo -e "${GREEN}✅ You are now back on the $ORIGINAL_BRANCH branch${NC}"
echo ""
echo -e "${BLUE}📊 Deployment Summary:${NC}"
echo -e "   Source branch:      ${BLUE}$ORIGINAL_BRANCH${NC}"
echo -e "   Deployed to:        ${BLUE}$REMOTE/$STABLE_BRANCH${NC}"
echo -e "   Deployment time:    ${BLUE}$(date)${NC}"
echo ""
echo -e "${YELLOW}🎉 MLB XR Branding Guide stable deployment complete!${NC}"
