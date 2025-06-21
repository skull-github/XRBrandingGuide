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
        this.rootDir = path.join(__dirname, '..', '..');
        this.readmePath = path.join(this.rootDir, 'README.md');
        this.docsDir = path.join(__dirname);
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
            // Only detect main section headers (##) not subsections (### or ####)
            const headerMatch = line.match(/^(#{2})\s+(.+)/);
            
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
                // Include all content including subsections (### and ####)
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

    <!-- Sticky Navigation Buttons -->
    <div class="sticky-nav-buttons" id="stickyNavButtons">
        <button class="sticky-nav-btn back-to-top" id="backToTopBtn" title="Back to Top">
            ↑
        </button>
        <a href="../" class="sticky-nav-btn back-to-home" title="Back to Home">
            🏠
        </a>
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
                // Only add minimal developer-standard emojis for key sections
                let displayTitle = cleanTitle;
                if (cleanTitle.toLowerCase().includes('quick start')) displayTitle = '🚀 ' + cleanTitle;
                if (cleanTitle.toLowerCase().includes('api endpoints')) displayTitle = '🔗 ' + cleanTitle;
                if (cleanTitle.toLowerCase().includes('interactive documentation')) displayTitle = '📚 ' + cleanTitle;
                return `<li><a href="#${section.id}" class="nav-link">${displayTitle}</a></li>`;
            })
            .join('\n                ');
    }

    sectionToHtml(section) {
        const cleanTitle = this.cleanEmojiContent(section.title);
        
        // Apply typography classes based on section level
        const titleClass = section.level === 2 ? 'text-title-bold' : 'text-headline-bold';
        
        let html = `<section id="${section.id}" class="section">\n`;
        html += `    <h2 class="${titleClass}">${cleanTitle}</h2>\n`;
        
        // Debug: Log the section content
        console.log(`Section: ${cleanTitle}, Content length: ${section.content?.length || 0}`);
        if (section.content) {
            console.log(`First 100 chars: ${section.content.substring(0, 100)}`);
        }
        
        // Special handling for Typography section
        if (cleanTitle.includes('Typography') && cleanTitle.includes('Style Guide')) {
            html += this.generateTypographyShowcase();
        } else {
            // Convert markdown content to HTML (simplified)
            const htmlContent = this.markdownToHtml(section.content || '');
            if (htmlContent.trim()) {
                html += `    ${htmlContent.replace(/\n/g, '\n    ')}\n`;
            } else {
                // Add placeholder if no content
                html += `    <p class="text-body">Content for this section is being processed...</p>\n`;
            }
        }
        
        html += `</section>\n`;
        
        return html;
    }

    generateTypographyShowcase() {
        const typographyData = [
            { name: 'Score', xrSize: '140px', webSize: '70px', weight: 'Bold', useCase: 'Key metrics, scores, large numbers', class: 'text-score' },
            { name: 'Marquee', xrSize: '96px', webSize: '48px', weight: 'Bold', useCase: 'Main headlines, hero text', class: 'text-marquee' },
            { name: 'Display', xrSize: '76px', webSize: '38px', weight: 'Semibold', useCase: 'Primary section headers', class: 'text-display' },
            { name: 'Title', xrSize: '58px', webSize: '29px', weight: 'Semibold', useCase: 'Subsection headers', class: 'text-title' },
            { name: 'Headline', xrSize: '48px', webSize: '24px', weight: 'Semibold', useCase: 'Component headers', class: 'text-headline' },
            { name: 'SubHeadline', xrSize: '38px', webSize: '19px', weight: 'Medium', useCase: 'Minor headers, labels', class: 'text-subheadline' },
            { name: 'Body', xrSize: '34px', webSize: '17px', weight: 'Regular', useCase: 'Main content text', class: 'text-body' },
            { name: 'Body Bold', xrSize: '34px', webSize: '17px', weight: 'Bold', useCase: 'Emphasized content', class: 'text-body-bold' },
            { name: 'System', xrSize: '30px', webSize: '15px', weight: 'Medium', useCase: 'UI elements, buttons', class: 'text-system' },
            { name: 'Legal', xrSize: '26px', webSize: '13px', weight: 'Regular', useCase: 'Fine print, disclaimers', class: 'text-legal' }
        ];

        let html = `
            <div class="typography-showcase">
                <p class="text-body">The MLB XR Branding Guide uses a consistent typography system optimized for both XR applications and web interfaces. Web sizes are 50% of the original XR sizes for better readability.</p>
                
                <h3 class="text-headline">Typography Breakdown</h3>
                <table class="typography-table">
                    <thead>
                        <tr>
                            <th>Style</th>
                            <th>XR Size</th>
                            <th>Web Size</th>
                            <th>Weight</th>
                            <th>Use Case</th>
                            <th>CSS Class</th>
                        </tr>
                    </thead>
                    <tbody>`;

        typographyData.forEach(item => {
            html += `
                        <tr>
                            <td class="style-name">${item.name}</td>
                            <td class="size-comparison">${item.xrSize}</td>
                            <td class="size-comparison">${item.webSize}</td>
                            <td>${item.weight}</td>
                            <td>${item.useCase}</td>
                            <td><code>.${item.class}</code></td>
                        </tr>`;
        });

        html += `
                    </tbody>
                </table>

                <h3 class="text-headline">Visual Examples</h3>
                <div class="typography-samples">`;

        // Add visual examples for key typography styles
        const exampleStyles = [
            { name: 'Score', class: 'text-score', example: '140/112' },
            { name: 'Marquee', class: 'text-marquee', example: 'MLB XR Branding' },
            { name: 'Display', class: 'text-display', example: 'Section Header' },
            { name: 'Title', class: 'text-title', example: 'Subsection Title' },
            { name: 'Headline', class: 'text-headline', example: 'Component Headline' },
            { name: 'Body', class: 'text-body', example: 'This is body text used for main content and paragraphs.' }
        ];

        exampleStyles.forEach(item => {
            html += `
                    <div class="typography-sample">
                        <div class="typography-label">
                            <span class="typography-name">${item.name}</span>
                            <span class="typography-sizes">XR → Web</span>
                        </div>
                        <div class="typography-example ${item.class}">${item.example}</div>
                    </div>`;
        });

        html += `
                </div>

                <h3 class="text-headline">Font Specifications</h3>
                <ul class="text-body">
                    <li><strong>Primary Font:</strong> MLB HEX Franklin (woff2/otf available in assets)</li>
                    <li><strong>Fallback:</strong> Inter, system-ui, -apple-system, sans-serif</li>
                    <li><strong>Weights Available:</strong> Light (300), Regular (400), Medium (500), Semibold (600), Bold (700), Extrabold (800), Black (900)</li>
                    <li><strong>Line Height:</strong> Ranges from 1.1 (Score) to 1.5 (Body) for optimal readability</li>
                    <li><strong>Letter Spacing:</strong> Tighter on larger sizes (-0.02em), normal on body text</li>
                </ul>

                <h3 class="text-headline">Responsive Behavior</h3>
                <ul class="text-body">
                    <li><strong>Desktop:</strong> Full web sizes (50% of XR)</li>
                    <li><strong>Tablet:</strong> 75% of web sizes</li>
                    <li><strong>Mobile:</strong> 60% of web sizes</li>
                </ul>
            </div>`;

        return html;
    }

    markdownToHtml(markdown) {
        // First, protect code blocks by replacing them with placeholders
        const codeBlocks = [];
        let processedMarkdown = markdown.replace(/```(\w*)\n?([\s\S]*?)```/g, (match, language, code) => {
            const placeholder = `__CODE_BLOCK_${codeBlocks.length}__`;
            codeBlocks.push({ language, code: code.trim() });
            return placeholder;
        });

        // Split into lines for better processing
        const lines = processedMarkdown.split('\n');
        const processedLines = [];
        let inList = false;
        let listType = null; // 'ul' or 'ol'

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const nextLine = lines[i + 1];

            // Check if this is a list item
            const bulletMatch = line.match(/^- (.+)$/);
            const numberMatch = line.match(/^\d+\. (.+)$/);
            
            if (bulletMatch || numberMatch) {
                const content = bulletMatch ? bulletMatch[1] : numberMatch[1];
                const currentListType = bulletMatch ? 'ul' : 'ol';
                
                // Start new list if needed
                if (!inList) {
                    processedLines.push(`<${currentListType}>`);
                    inList = true;
                    listType = currentListType;
                } else if (listType !== currentListType) {
                    // Switch list type
                    processedLines.push(`</${listType}>`);
                    processedLines.push(`<${currentListType}>`);
                    listType = currentListType;
                }
                
                processedLines.push(`<li class="text-body">${this.processInlineMarkdown(content)}</li>`);
            } else {
                // Close list if we were in one
                if (inList) {
                    processedLines.push(`</${listType}>`);
                    inList = false;
                    listType = null;
                }
                
                // Process headers
                if (line.match(/^### (.+)$/)) {
                    const title = line.replace(/^### /, '').replace(/\*\*/g, '');
                    processedLines.push(`<h3 class="text-headline">${this.processInlineMarkdown(title)}</h3>`);
                } else if (line.match(/^#### (.+)$/)) {
                    const title = line.replace(/^#### /, '').replace(/\*\*/g, '');
                    processedLines.push(`<h4 class="text-subheadline">${this.processInlineMarkdown(title)}</h4>`);
                } else if (line.includes('__CODE_BLOCK_')) {
                    // Code block placeholder - don't wrap in paragraph
                    processedLines.push(line);
                } else if (line.trim() && !line.startsWith('<')) {
                    // Regular content line
                    processedLines.push(`<p class="text-body">${this.processInlineMarkdown(line)}</p>`);
                } else if (line.trim() === '') {
                    // Empty line
                    processedLines.push('');
                } else {
                    // Already HTML content
                    processedLines.push(line);
                }
            }
        }
        
        // Close any remaining list
        if (inList) {
            processedLines.push(`</${listType}>`);
        }

        processedMarkdown = processedLines.join('\n');

        // Clean up multiple newlines
        processedMarkdown = processedMarkdown.replace(/\n\s*\n+/g, '\n');

        // Restore code blocks
        codeBlocks.forEach((block, index) => {
            const placeholder = `__CODE_BLOCK_${index}__`;
            const codeHtml = `<div class="code-block"><pre class="text-code">${block.language ? block.language + '\n' : ''}${block.code}</pre></div>`;
            processedMarkdown = processedMarkdown.replace(placeholder, codeHtml);
        });

        return processedMarkdown.trim();
    }

    processInlineMarkdown(text) {
        return text
            // Clean emojis first
            .replace(/[\u{1F600}-\u{1F64F}]/gu, '') // Emoticons
            .replace(/[\u{1F300}-\u{1F5FF}]/gu, '') // Misc Symbols and Pictographs
            .replace(/[\u{1F680}-\u{1F6FF}]/gu, '') // Transport and Map
            .replace(/[\u{1F700}-\u{1F77F}]/gu, '') // Alchemical Symbols
            .replace(/[\u{1F780}-\u{1F7FF}]/gu, '') // Geometric Shapes Extended
            .replace(/[\u{1F800}-\u{1F8FF}]/gu, '') // Supplemental Arrows-C
            .replace(/[\u{1F900}-\u{1F9FF}]/gu, '') // Supplemental Symbols and Pictographs
            .replace(/[\u{1FA00}-\u{1FA6F}]/gu, '') // Chess Symbols
            .replace(/[\u{1FA70}-\u{1FAFF}]/gu, '') // Symbols and Pictographs Extended-A
            .replace(/[\u{2600}-\u{26FF}]/gu, '')   // Misc symbols
            .replace(/[\u{2700}-\u{27BF}]/gu, '')   // Dingbats
            .replace(/[\u{FE00}-\u{FE0F}]/gu, '')   // Variation Selectors
            .replace(/[\u{1F1E0}-\u{1F1FF}]/gu, '') // Flags
            // Bold text
            .replace(/\*\*(.+?)\*\*/g, '<strong class="text-body-bold">$1</strong>')
            // Inline code
            .replace(/`([^`]+)`/g, '<code class="text-code inline-code">$1</code>')
            // Clean up any remaining markdown and extra spaces
            .replace(/\*\*/g, '')
            .replace(/\s+/g, ' ')
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
        // Remove all emojis first, then we'll add back only specific ones in navigation
        return text
            // Remove emoji unicode ranges
            .replace(/[\u{1F600}-\u{1F64F}]/gu, '') // Emoticons
            .replace(/[\u{1F300}-\u{1F5FF}]/gu, '') // Misc Symbols and Pictographs
            .replace(/[\u{1F680}-\u{1F6FF}]/gu, '') // Transport and Map
            .replace(/[\u{1F700}-\u{1F77F}]/gu, '') // Alchemical Symbols
            .replace(/[\u{1F780}-\u{1F7FF}]/gu, '') // Geometric Shapes Extended
            .replace(/[\u{1F800}-\u{1F8FF}]/gu, '') // Supplemental Arrows-C
            .replace(/[\u{1F900}-\u{1F9FF}]/gu, '') // Supplemental Symbols and Pictographs
            .replace(/[\u{1FA00}-\u{1FA6F}]/gu, '') // Chess Symbols
            .replace(/[\u{1FA70}-\u{1FAFF}]/gu, '') // Symbols and Pictographs Extended-A
            .replace(/[\u{2600}-\u{26FF}]/gu, '')   // Misc symbols
            .replace(/[\u{2700}-\u{27BF}]/gu, '')   // Dingbats
            .replace(/[\u{FE00}-\u{FE0F}]/gu, '')   // Variation Selectors
            .replace(/[\u{1F1E0}-\u{1F1FF}]/gu, '') // Flags
            // Clean up text artifacts
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
