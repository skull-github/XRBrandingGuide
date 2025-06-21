#!/bin/bash

# MLB XR Branding Guide - Documentation Deployment Script
# Auto-syncs README and deploys documentation site

echo "📚 MLB XR Documentation Deployment"
echo "=================================="

# Change to docs directory
cd "$(dirname "$0")"

# Sync documentation with README
echo "🔄 Syncing with README.md..."
node sync-readme.js

if [ $? -eq 0 ]; then
    echo "✅ Documentation sync successful"
else
    echo "❌ Documentation sync failed"
    exit 1
fi

# Check if we're in a git repository
if [ -d "../.git" ]; then
    echo "📤 Committing documentation updates..."
    
    # Go back to root directory for git operations
    cd ..
    
    # Add documentation files
    git add docs/
    
    # Commit if there are changes
    if ! git diff --staged --quiet; then
        git commit -m "📚 DOCS: Auto-sync documentation site with README

- Updated HTML documentation from README.md
- Refreshed team color mapping
- Auto-generated responsive documentation site
- Timestamp: $(date)"
        
        echo "✅ Documentation committed to git"
    else
        echo "ℹ️  No documentation changes to commit"
    fi
else
    echo "ℹ️  Not in a git repository, skipping git operations"
fi

echo ""
echo "🎉 Documentation deployment complete!"
echo ""
echo "📋 Next steps:"
echo "   • Open docs/index.html in a browser to view the site"
echo "   • Run 'cd docs && npm run serve' to start a local server"
echo "   • Run 'cd docs && npm run watch' to auto-sync on README changes"
echo ""
echo "🌐 Documentation is ready to be hosted on any static site platform"
