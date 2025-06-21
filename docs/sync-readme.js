#!/usr/bin/env node

/**
 * README to HTML Documentation Sync Script
 * 
 * This script automatically converts the README.md file to structured HTML
 * documentation and updates the documentation site.
 * 
 * Features:
 * - Parses README.md markdown content
 * - Extracts sections and converts to HTML
 * - Updates team color data from spot color mapping
 * - Generates responsive HTML documentation
 * - Auto-syncs on file changes (optional)
 */

const fs = require('fs');
const path = require('path');

class ReadmeToHtmlSync {
    constructor() {
        this.rootDir = path.join(__dirname, '..');
        this.readmePath = path.join(this.rootDir, 'README.md');
        this.docsDir = path.join(this.rootDir, 'docs');
        this.templatePath = path.join(this.docsDir, 'template.html');
        this.outputPath = path.join(this.docsDir, 'index.html');
        
        this.sections = {};
        this.teamColors = {};
    }

    async sync() {
        try {
            console.log('Starting README to HTML sync...');
            
            // Read and parse README
            await this.parseReadme();
            
            // Load team colors from spot color mapping
            await this.loadTeamColors();
            
            // Generate HTML content
            await this.generateHtml();
            
            console.log('Documentation sync completed successfully!');
            console.log(`Updated: ${this.outputPath}`);
            
        } catch (error) {
            console.error('Sync failed:', error);
            process.exit(1);
        }
    }

    async parseReadme() {
        console.log('Parsing README.md...');
        
        if (!fs.existsSync(this.readmePath)) {
            throw new Error(`README.md not found at ${this.readmePath}`);
        }

        const content = fs.readFileSync(this.readmePath, 'utf8');
        const lines = content.split('\n');
        
        let currentSection = null;
        let currentContent = [];
        
        lines.forEach(line => {
            // Detect section headers (## or ###)
            const headerMatch = line.match(/^(#{2,3})\s+(.+)/);
            
            if (headerMatch) {
                // Save previous section
                if (currentSection) {
                    this.sections[currentSection.id] = {
                        ...currentSection,
                        content: currentContent.join('\n').trim()
                    };
                }
                
                // Start new section
                const level = headerMatch[1].length;
                const title = headerMatch[2];
                const id = this.generateSectionId(title);
                
                currentSection = {
                    id,
                    title,
                    level,
                    emoji: this.extractEmoji(title)
                };
                currentContent = [];
            } else if (currentSection) {
                currentContent.push(line);
            }
        });
        
        // Save last section
        if (currentSection) {
            this.sections[currentSection.id] = {
                ...currentSection,
                content: currentContent.join('\n').trim()
            };
        }
        
        console.log(`Parsed ${Object.keys(this.sections).length} sections`);
    }

    async loadTeamColors() {
        console.log('Loading team colors...');
        
        const spotColorPath = path.join(this.rootDir, 'src', 'utils', 'spotColorMapping.js');
        const teamExtrasPath = path.join(this.rootDir, 'src', 'team-extras.json');
        
        // Load team extras (venue info, URLs)
        let teamExtras = {};
        if (fs.existsSync(teamExtrasPath)) {
            try {
                const teamExtrasContent = fs.readFileSync(teamExtrasPath, 'utf8');
                teamExtras = JSON.parse(teamExtrasContent);
                console.log(`Loaded team extras for ${Object.keys(teamExtras).length} teams`);
            } catch (error) {
                console.warn('⚠️  Could not parse team extras:', error.message);
            }
        }
        
        if (fs.existsSync(spotColorPath)) {
            try {
                const spotColorContent = fs.readFileSync(spotColorPath, 'utf8');
                
                // Extract team color mapping (simplified parsing)
                const teamMatches = spotColorContent.match(/(\d+):\s*['"`]([#\w]+)['"`]/g);
                
                if (teamMatches) {
                    teamMatches.forEach(match => {
                        const [, teamId, color] = match.match(/(\d+):\s*['"`]([#\w]+)['"`]/);
                        this.teamColors[teamId] = {
                            color,
                            // Add team extras if available
                            ...(teamExtras[teamId] || {}),
                            // You could enhance this to extract team names from other files
                            name: `Team ${teamId}`
                        };
                    });
                }
                
                console.log(`Loaded ${Object.keys(this.teamColors).length} team colors`);
            } catch (error) {
                console.warn('⚠️  Could not parse spot color mapping:', error.message);
            }
        }
    }

    async generateHtml() {
        console.log('Generating HTML documentation...');
        
        // Create the complete HTML structure
        const htmlContent = this.buildCompleteHtml();
        
        // Write to output file
        fs.writeFileSync(this.outputPath, htmlContent, 'utf8');
        
        console.log('HTML documentation generated');
    }

    buildCompleteHtml() {
        const sections = Object.values(this.sections)
            .filter(section => section.level === 2) // Only main sections
            .map(section => this.sectionToHtml(section))
            .join('\n');

        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MLB XR Branding Guide - Documentation</title>
    <meta name="description" content="Comprehensive documentation for the MLB XR Branding Guide - Official MLB team colors, API integration, and development workflow.">
    <meta name="keywords" content="MLB, XR, Branding, React, Team Colors, API, Documentation">
    <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><circle cx='50' cy='50' r='50' fill='%23FF4444'/><text x='50' y='70' font-size='60' text-anchor='middle' fill='white'>⚾</text></svg>">
    <link rel="stylesheet" href="styles.css">
    <link rel="stylesheet" href="typography.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
</head>
<body>
    <div class="container">
        <!-- Navigation -->
        <nav class="sidebar" id="sidebar">
            <div class="sidebar-header">
                <h2>MLB XR Guide</h2>
                <button class="menu-toggle" id="menuToggle">☰</button>
            </div>
            <ul class="nav-menu" id="navMenu">
                ${this.generateNavigation()}
            </ul>
            <div class="sidebar-footer">
                <p>Last Updated: <span id="lastUpdated">${new Date().toLocaleDateString()}</span></p>
                <p><a href="../README.md" target="_blank">View README</a></p>
                <p><small>Auto-synced from README.md</small></p>
            </div>
        </nav>

        <!-- Main Content -->
        <main class="main-content" id="mainContent">
            <!-- Header -->
            <header class="header">
                <h1 class="text-marquee">MLB XR Branding Guide</h1>
                <p class="text-headline subtitle">Official MLB team branding assets for Extended Reality applications</p>
                <div class="status-badges">
                    <span class="badge badge-success">Active</span>
                    <span class="badge badge-info">📚 Documentation</span>
                    <span class="badge badge-warning">Auto-Sync</span>
                </div>
            </header>

            <!-- Documentation Content -->
            <div id="documentationContent">
                ${sections}
            </div>
        </main>
    </div>

    <!-- Color Preview Modal -->
    <div id="colorModal" class="modal">
        <div class="modal-content">
            <span class="close">&times;</span>
            <h3 id="modalTeamName">Team Color</h3>
            <div class="color-preview" id="modalColorPreview"></div>
            <div class="color-details">
                <p><strong>Hex:</strong> <span id="modalHex"></span></p>
                <p><strong>RGB:</strong> <span id="modalRgb"></span></p>
                <p><strong>Team ID:</strong> <span id="modalTeamId"></span></p>
            </div>
            <div class="usage-example">
                <h4>Usage Example:</h4>
                <pre><code id="modalUsageCode"></code></pre>
            </div>
        </div>
    </div>

    <script src="script.js"></script>
</body>
</html>`;
    }

    generateNavigation() {
        return Object.values(this.sections)
            .filter(section => section.level === 2)
            .map(section => {
                const cleanTitle = this.cleanEmojiContent(section.title);
                // Add developer-standard emojis back for specific sections
                let displayTitle = cleanTitle;
                if (cleanTitle.includes('Quick Start')) displayTitle = '🚀 ' + cleanTitle;
                if (cleanTitle.includes('API Endpoints')) displayTitle = '🔗 ' + cleanTitle;
                return `<li><a href="#${section.id}" class="nav-link">${displayTitle}</a></li>`;
            })
            .join('\n                ');
    }

    sectionToHtml(section) {
        let html = `<section id="${section.id}" class="section">`;
        const cleanTitle = this.cleanEmojiContent(section.title);
        
        // Apply typography classes based on section level
        const titleClass = section.level === 2 ? 'text-title-bold' : 'text-headline-bold';
        html += `<h2 class="${titleClass}">${cleanTitle}</h2>`;
        
        // Convert markdown content to HTML (simplified)
        const htmlContent = this.markdownToHtml(section.content);
        html += htmlContent;
        
        html += `</section>`;
        
        return html;
    }

    markdownToHtml(markdown) {
        return markdown
            // Headers with typography classes
            .replace(/^### (.+)$/gm, '<h3 class="text-headline">$1</h3>')
            .replace(/^#### (.+)$/gm, '<h4 class="text-subheadline">$1</h4>')
            
            // Code blocks
            .replace(/```([\s\S]*?)```/g, '<div class="code-block"><pre class="text-code">$1</pre></div>')
            
            // Inline code
            .replace(/`([^`]+)`/g, '<code class="text-code inline-code">$1</code>')
            
            // Bold text
            .replace(/\*\*(.+?)\*\*/g, '<strong class="text-body-bold">$1</strong>')
            
            // Lists
            .replace(/^- (.+)$/gm, '<li class="text-body">$1</li>')
            .replace(/^\d+\. (.+)$/gm, '<li class="text-body">$1</li>')
            
            // Wrap lists (simplified)
            .replace(/(<li>.*<\/li>)/g, '<ul>$1</ul>')
            
            // Paragraphs with body text class
            .replace(/^([^<\n\r].*)$/gm, '<p class="text-body">$1</p>')
            
            // Clean up
            .replace(/\n\s*\n/g, '\n')
            .trim();
    }

    generateSectionId(title) {
        return title
            .toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/^[\w\s]*-/, ''); // Remove emoji and extra chars
    }

    extractEmoji(title) {
        const emojiMatch = title.match(/^([^\w\s]+)/);
        return emojiMatch ? emojiMatch[1] : '📄';
    }

    // Clean up emojis, keeping only developer-standard ones
    cleanEmojiContent(text) {
        // Keep only developer-standard emojis: 🚀 (deployment/launch), 📚 (documentation), 🔗 (links/APIs), ⚾ (baseball/project specific)
        // Remove excessive/decorative emojis but preserve meaningful ones
        return text
            .replace(/🏗️\s*/g, '') // Remove construction emoji (not standard for dev)
            .replace(/🎯\s*/g, '') // Remove target emoji
            .replace(/🎨\s*/g, '') // Remove art emoji
            .replace(/🌐\s*/g, '') // Remove globe emoji
            .replace(/✨\s*/g, '') // Remove sparkles emoji
            .replace(/🔧\s*/g, '') // Remove wrench emoji
            .replace(/📦\s*/g, '') // Remove package emoji (keep for actual packages)
            .replace(/📱\s*/g, '') // Remove mobile emoji
            .replace(/📋\s*/g, '') // Remove clipboard emoji
            .replace(/📊\s*/g, '') // Remove chart emoji
            .replace(/🛡️\s*/g, '') // Remove shield emoji
            .replace(/🎵\s*/g, '') // Remove music emoji
            .replace(/✅\s*/g, '') // Remove checkmark emoji (not standard)
            .replace(/🔄\s*/g, '') // Remove refresh emoji (not standard)
            .replace(/⚠️\s*/g, '') // Remove warning emoji (not standard)
            // Clean up duplicate spaces and markdown
            .replace(/\*\*([^*]+)\*\*/g, '$1') // Clean markdown bold
            .replace(/\s+/g, ' ') // Clean multiple spaces
            .trim();
    }

    // Watch for changes in README.md
    watchForChanges() {
        console.log('Watching for README.md changes...');
        
        fs.watchFile(this.readmePath, (curr, prev) => {
            console.log('README.md changed, syncing documentation...');
            this.sync();
        });
    }
}

// CLI Usage
if (require.main === module) {
    const sync = new ReadmeToHtmlSync();
    
    const args = process.argv.slice(2);
    
    if (args.includes('--watch')) {
        sync.sync().then(() => {
            sync.watchForChanges();
        });
    } else {
        sync.sync();
    }
}

module.exports = ReadmeToHtmlSync;
