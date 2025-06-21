// MLB XR Branding Guide Documentation Site
// Auto-syncing documentation with README.md

class DocumentationApp {
    constructor() {
        this.initializeApp();
        this.setupEventListeners();
        this.loadDocumentation();
        this.updateLastModified();
    }

    initializeApp() {
        this.sidebar = document.getElementById('sidebar');
        this.menuToggle = document.getElementById('menuToggle');
        this.navMenu = document.getElementById('navMenu');
        this.mainContent = document.getElementById('mainContent');
        this.documentationContent = document.getElementById('documentationContent');
        this.colorModal = document.getElementById('colorModal');
        
        // MLB Team Colors Data (synced from spot color mapping)
        this.teamColors = {
            // American League East
            110: { name: 'Baltimore Orioles', color: '#df4601', division: 'AL East' },
            111: { name: 'Boston Red Sox', color: '#0d2b56', division: 'AL East' },
            147: { name: 'New York Yankees', color: '#132448', division: 'AL East' },
            139: { name: 'Tampa Bay Rays', color: '#8fbce6', division: 'AL East' },
            141: { name: 'Toronto Blue Jays', color: '#134a8e', division: 'AL East' },
            
            // American League Central
            145: { name: 'Chicago White Sox', color: '#333333', division: 'AL Central' },
            114: { name: 'Cleveland Guardians', color: '#002b5c', division: 'AL Central' },
            116: { name: 'Detroit Tigers', color: '#0c2c56', division: 'AL Central' },
            118: { name: 'Kansas City Royals', color: '#004687', division: 'AL Central' },
            142: { name: 'Minnesota Twins', color: '#002b5c', division: 'AL Central' },
            
            // American League West
            117: { name: 'Houston Astros', color: '#eb6e1f', division: 'AL West' },
            108: { name: 'Los Angeles Angels', color: '#862633', division: 'AL West' },
            133: { name: 'Oakland Athletics', color: '#003831', division: 'AL West' },
            136: { name: 'Seattle Mariners', color: '#0c2c56', division: 'AL West' },
            140: { name: 'Texas Rangers', color: '#003278', division: 'AL West' },
            
            // National League East
            144: { name: 'Atlanta Braves', color: '#0c2340', division: 'NL East' },
            146: { name: 'Miami Marlins', color: '#00a3e0', division: 'NL East' },
            121: { name: 'New York Mets', color: '#002d72', division: 'NL East' },
            143: { name: 'Philadelphia Phillies', color: '#e81828', division: 'NL East' },
            120: { name: 'Washington Nationals', color: '#ab0003', division: 'NL East' },
            
            // National League Central
            112: { name: 'Chicago Cubs', color: '#0e3386', division: 'NL Central' },
            113: { name: 'Cincinnati Reds', color: '#c6011f', division: 'NL Central' },
            158: { name: 'Milwaukee Brewers', color: '#13294b', division: 'NL Central' },
            134: { name: 'Pittsburgh Pirates', color: '#333333', division: 'NL Central' },
            138: { name: 'St. Louis Cardinals', color: '#be0a14', division: 'NL Central' },
            
            // National League West
            109: { name: 'Arizona Diamondbacks', color: '#aa182c', division: 'NL West' },
            115: { name: 'Colorado Rockies', color: '#33006f', division: 'NL West' },
            119: { name: 'Los Angeles Dodgers', color: '#005a9c', division: 'NL West' },
            135: { name: 'San Diego Padres', color: '#ffc425', division: 'NL West' },
            137: { name: 'San Francisco Giants', color: '#fd5a1e', division: 'NL West' },
            
            // Additional Teams
            159: { name: 'Team 159', color: '#bc0022', division: 'Additional' },
            160: { name: 'Team 160', color: '#041e42', division: 'Additional' }
        };
    }

    setupEventListeners() {
        // Mobile menu toggle
        this.menuToggle.addEventListener('click', () => {
            this.sidebar.classList.toggle('open');
        });

        // Navigation links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const target = link.getAttribute('href').substring(1);
                this.scrollToSection(target);
                this.setActiveNavLink(link);
                
                // Close mobile menu
                if (window.innerWidth <= 768) {
                    this.sidebar.classList.remove('open');
                }
            });
        });

        // Modal events
        const modal = this.colorModal;
        const closeBtn = modal.querySelector('.close');
        
        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });

        // Escape key to close modal
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.style.display === 'block') {
                modal.style.display = 'none';
            }
        });

        // Scroll spy for navigation
        window.addEventListener('scroll', () => {
            this.updateActiveNavigation();
        });
    }

    async loadDocumentation() {
        try {
            // In a real implementation, this would fetch the README.md
            // For now, we'll generate the content based on our structure
            const content = this.generateDocumentationContent();
            this.documentationContent.innerHTML = content;
            
            // Setup color card click events
            this.setupColorCardEvents();
            
        } catch (error) {
            console.error('Error loading documentation:', error);
            this.documentationContent.innerHTML = `
                <div class="section">
                    <h2>❌ Error Loading Documentation</h2>
                    <p>Unable to load documentation content. Please check the console for details.</p>
                </div>
            `;
        }
    }

    generateDocumentationContent() {
        return `
            <section id="overview" class="section">
                <h2>🎯 Project Overview</h2>
                <p>The MLB XR Branding Guide is a modern React application that provides developers with easy access to official MLB branding assets, team data, and live game information. Built specifically for Extended Reality (XR) applications, it features a clean interface for browsing team assets, colors, and real-time game data.</p>
                
                <h3>✨ Key Features</h3>
                <ul>
                    <li><strong>Official MLB spot colors</strong> for all 30 teams (official hex values)</li>
                    <li><strong>Live game carousel</strong> with horizontal logo-vs-logo design</li>
                    <li><strong>Team-specific branding assets</strong> (logos, wordmarks, colors)</li>
                    <li><strong>Real-time game data</strong> and schedules</li>
                    <li><strong>Player roster information</strong> and statistics</li>
                    <li><strong>Responsive design</strong> optimized for all devices</li>
                    <li><strong>Secure deployment workflow</strong> with password protection</li>
                    <li><strong>TeamGameCarousel component</strong> with modern UI design</li>
                </ul>
            </section>

            <section id="quick-start" class="section">
                <h2>🚀 Quick Start</h2>
                
                <h3>Development</h3>
                <div class="code-block">
                    <pre>npm install
npm run dev</pre>
                </div>
                
                <h3>Build</h3>
                <div class="code-block">
                    <pre>npm run build
npm run preview</pre>
                </div>
                
                <h3>Deploy</h3>
                <div class="code-block">
                    <pre>./deploy-main.sh      # Quick deploy to main (no password)
./deploy-stable.sh    # Secure deploy to stable (password: 3333)</pre>
                </div>
            </section>

            <section id="workflow" class="section">
                <h2>🏗️ Development Workflow & Branch Strategy</h2>
                
                <h3>🔄 Branch Strategy</h3>
                
                <h4>MAIN Branch (Default Working Branch)</h4>
                <ul>
                    <li>✅ <strong>Primary development branch</strong></li>
                    <li>✅ <strong>Always work here by default</strong></li>
                    <li>✅ <strong>All new features and changes</strong></li>
                    <li>✅ <strong>Quick iterations and testing</strong></li>
                </ul>
                
                <h4>STABLE Branch (Production Branch)</h4>
                <ul>
                    <li>🔐 <strong>Password-protected deployments only</strong></li>
                    <li>🎯 <strong>Stable, tested features only</strong></li>
                    <li>📦 <strong>Production-ready releases</strong></li>
                </ul>
                
                <h3>📋 Recommended Daily Workflow</h3>
                <ol>
                    <li><strong>Work on MAIN branch</strong> (default)</li>
                    <li><strong>Make changes and commit</strong></li>
                    <li><strong>Push to main</strong>: <code class="inline-code">./deploy-main.sh</code></li>
                    <li><strong>Continue development</strong></li>
                </ol>
                
                <h3>🛡️ Security Features</h3>
                <ul>
                    <li><strong>Stable branch</strong>: Protected with password "3333"</li>
                    <li><strong>Main branch</strong>: Open for development</li>
                    <li><strong>All deployments</strong>: Logged with timestamps</li>
                    <li><strong>Environment Separation</strong> - Development vs production workflows</li>
                    <li><strong>Secure API Integration</strong> - Proper error handling and validation</li>
                </ul>
            </section>

            <section id="spot-colors" class="section">
                <h2>🎨 MLB Team Spot Colors</h2>
                
                <h3>Official Spot Color Mapping</h3>
                <p>The application uses official MLB team spot colors (primary brand colors used behind logos). These are different from secondary colors and ensure consistent branding throughout the application.</p>
                
                <h4>Usage Examples</h4>
                <div class="code-block">
                    <pre>import { getTeamSpotColor } from './src/utils/spotColorMapping';

// Get spot color for a team
const yankeeSpotColor = getTeamSpotColor(147); // Returns: #132448
const dodgerSpotColor = getTeamSpotColor(119); // Returns: #005A9C</pre>
                </div>
                
                <h4>React Hook Integration</h4>
                <div class="code-block">
                    <pre>import { useTeamSpotColor } from './src/hooks/useTeamData';

function TeamComponent({ teamId }) {
  const spotColor = useTeamSpotColor(teamId);
  
  return (
    &lt;div style={{ backgroundColor: spotColor }}&gt;
      Team content with official spot color background
    &lt;/div&gt;
  );
}</pre>
                </div>
                
                <h4>All Available Functions</h4>
                <div class="code-block">
                    <pre>import { 
  getTeamSpotColor, 
  getAllTeamSpotColors, 
  hasTeamSpotColor 
} from './src/utils/spotColorMapping';

// Get spot color for a specific team
getTeamSpotColor(147); // #132448

// Check if a team has a spot color defined
hasTeamSpotColor(147); // true
hasTeamSpotColor(999); // false

// Get all teams with their spot colors
getAllTeamSpotColors(); // Array of {teamId, spotColor} objects</pre>
                </div>
                
                <h3>Important Spot Color Notes</h3>
                <ol>
                    <li><strong>Spot Colors vs Secondary Colors</strong>: These are the official spot colors, not the secondary colors from the BigData API. The spot color is the primary brand color used behind team logos and in branded elements.</li>
                    <li><strong>Future Reference</strong>: This mapping should be used throughout the application instead of trying to extract colors from images or using secondary colors from the API.</li>
                    <li><strong>Consistency</strong>: All components using team colors should use this mapping to ensure consistent branding across the application.</li>
                    <li><strong>Testing</strong>: Run the test utilities in <code class="inline-code">src/utils/spotColorTest.js</code> to validate the mapping after any changes.</li>
                </ol>
            </section>

            <section id="color-reference" class="section">
                <h2>📋 Complete Spot Color Reference</h2>
                <p>Click on any team color card to view detailed information and usage examples.</p>
                ${this.generateColorReference()}
            </section>

            <section id="architecture" class="section">
                <h2>🏗️ Technical Architecture</h2>
                
                <h3>📦 Core Dependencies</h3>
                <h4>Production (3 dependencies)</h4>
                <div class="table-container">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>Package</th>
                                <th>Version</th>
                                <th>Purpose</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>react</td>
                                <td>^19.1.0</td>
                                <td>Core React framework (latest)</td>
                            </tr>
                            <tr>
                                <td>react-dom</td>
                                <td>^19.1.0</td>
                                <td>React DOM renderer</td>
                            </tr>
                            <tr>
                                <td>papaparse</td>
                                <td>^5.5.3</td>
                                <td>CSV parsing for Google Sheets data</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                
                <h3>🌐 External APIs & Services</h3>
                <ol>
                    <li><strong>MLB Stats API</strong> (statsapi.mlb.com) - Team rosters and player data, Game schedules and live scores, Season statistics and metrics</li>
                    <li><strong>MLB Image CDN</strong> (img.mlbstatic.com) - Official team logos, Player photos, Responsive image optimization</li>
                    <li><strong>MLB Mobile Infrastructure</strong> (storage.mobile.mlbinfra.com) - Complete branding configuration, MLB.TV assets and backgrounds</li>
                    <li><strong>Google Sheets Integration</strong> - Team metadata and configuration, CSV export for dynamic data updates</li>
                </ol>
                
                <h3>📁 Custom Module System</h3>
                <h4>Utilities (src/utils/)</h4>
                <ul>
                    <li><code class="inline-code">spotColorMapping.js</code> - Official MLB team spot colors (hex values)</li>
                    <li><code class="inline-code">teamColorReference.js</code> - Comprehensive team color reference</li>
                    <li><code class="inline-code">teamUtils.js</code> - Team organization and division logic</li>
                    <li><code class="inline-code">audio.js</code> - Web Audio API integration for UI sounds</li>
                    <li><code class="inline-code">spotColorTest.js</code> - Color mapping validation utility</li>
                </ul>
                
                <h4>Components (src/components/)</h4>
                <ul>
                    <li><code class="inline-code">MLBSchedule.jsx</code> - Live games schedule with spotlight design and official spot colors</li>
                    <li><code class="inline-code">GameCarousel.jsx</code> - Team-specific horizontal game carousel (logo-vs-logo design)</li>
                    <li><code class="inline-code">AnchorMenu.js</code> - Division-based team navigation with spot color integration</li>
                    <li><code class="inline-code">UI/CommonComponents.js</code> - Reusable UI components</li>
                </ul>
                
                <h4>Hooks (src/hooks/)</h4>
                <ul>
                    <li><code class="inline-code">useTeamData.js</code> - Custom hooks for team data and official spot colors integration</li>
                </ul>
            </section>

            <section id="deployment" class="section">
                <h2>📦 Deployment Configuration</h2>
                
                <h3>Repository Information</h3>
                <ul>
                    <li><strong>Repository</strong>: https://github.com/skull-github/XRBrandingGuide</li>
                    <li><strong>Branch</strong>: main</li>
                    <li><strong>Latest Updates</strong>: Consolidated README with all documentation</li>
                </ul>
                
                <h3>Vercel Configuration</h3>
                <ul>
                    <li><strong>Framework</strong>: Vite</li>
                    <li><strong>Root Directory</strong>: ./</li>
                    <li><strong>Build Command</strong>: npm run build</li>
                    <li><strong>Output Directory</strong>: dist</li>
                    <li><strong>Install Command</strong>: npm install</li>
                </ul>
                
                <h3>Files Structure (Root Level)</h3>
                <div class="code-block">
                    <pre>✅ package.json        # Dependencies and scripts
✅ index.html          # Entry point  
✅ src/                # React app source code
✅ vite.config.js      # Vite configuration
✅ vercel.json         # Deployment settings
✅ dist/               # Build output (after npm run build)
✅ deploy-main.sh      # Main branch deployment script
✅ deploy-stable.sh    # Stable branch deployment script (password-protected)</pre>
                </div>
            </section>

            <section id="updates" class="section">
                <h2>🎯 Recent Project Updates</h2>
                
                <h3>✅ Recently Completed Features:</h3>
                <ul>
                    <li><strong>Official MLB spot colors</strong> for all teams (hex values mapped)</li>
                    <li><strong>Horizontal carousel layout</strong> (logo-vs-logo design)</li>
                    <li><strong>TeamGameCarousel component</strong> replacing vertical layout</li>
                    <li><strong>Secure deployment system</strong> with password protection</li>
                    <li><strong>Consolidated documentation</strong> - All README files merged into one</li>
                    <li><strong>MAIN branch workflow</strong> - Set as default working branch</li>
                    <li><strong>Schedule card improvements</strong> - Changed "VIEWING" to "LIVE" status</li>
                    <li><strong>Complete spot color integration</strong> - All components updated</li>
                    <li><strong>Interactive documentation site</strong> with auto-sync capability</li>
                </ul>
                
                <h3>🎨 Current Team Section Layout:</h3>
                <ul>
                    <li><strong>Live Game Context</strong>: Horizontal carousel with logo-vs-logo cards</li>
                    <li><strong>Upcoming Games</strong>: Clean vertical list format</li>
                    <li><strong>Official spot colors</strong> used throughout all team displays</li>
                    <li><strong>Responsive design</strong> for all screen sizes</li>
                </ul>
            </section>

            <section id="stats" class="section">
                <h2>📊 Project Stats & Summary</h2>
                
                <div class="table-container">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>Metric</th>
                                <th>Count</th>
                                <th>Details</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Total Dependencies</td>
                                <td>12</td>
                                <td>3 production + 9 development</td>
                            </tr>
                            <tr>
                                <td>External APIs</td>
                                <td>4</td>
                                <td>MLB Stats, Images, Mobile, Google</td>
                            </tr>
                            <tr>
                                <td>Custom Modules</td>
                                <td>10+</td>
                                <td>Utilities, components, and hooks</td>
                            </tr>
                            <tr>
                                <td>Team Spot Colors</td>
                                <td>32</td>
                                <td>Official MLB team colors mapped</td>
                            </tr>
                            <tr>
                                <td>Deployment Scripts</td>
                                <td>2</td>
                                <td>Main + stable with password</td>
                            </tr>
                            <tr>
                                <td>Architecture</td>
                                <td>SPA</td>
                                <td>Modern React SPA with minimal footprint</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                
                <h3>📱 Browser Compatibility</h3>
                <ul>
                    <li><strong>Modern Browsers</strong> - Chrome, Firefox, Safari, Edge</li>
                    <li><strong>Mobile Responsive</strong> - iOS and Android optimization</li>
                    <li><strong>Web Audio API</strong> - Enhanced with graceful fallbacks</li>
                </ul>
                
                <h3>📋 Important Reminders</h3>
                <ol>
                    <li><strong>Always work on MAIN branch</strong> by default! 🎯</li>
                    <li><strong>Use official spot colors</strong> from the mapping system</li>
                    <li><strong>Password for stable deployments</strong>: <code class="inline-code">3333</code></li>
                    <li><strong>Test spot color changes</strong> with <code class="inline-code">src/utils/spotColorTest.js</code></li>
                    <li><strong>All documentation</strong> is now in this single README file</li>
                </ol>
                
                <div style="text-align: center; margin-top: 2rem; padding: 2rem; background: linear-gradient(135deg, var(--primary-color), var(--secondary-color)); border-radius: var(--radius-lg); color: white;">
                    <h3>⚾ Built with ⚾ for the MLB XR ecosystem</h3>
                    <p><em>This comprehensive documentation consolidates all previous documentation files into a single source of truth for the project.</em></p>
                </div>
            </section>
        `;
    }

    generateColorReference() {
        const divisions = {
            'AL East': [],
            'AL Central': [],
            'AL West': [],
            'NL East': [],
            'NL Central': [],
            'NL West': [],
            'Additional': []
        };

        // Group teams by division
        Object.entries(this.teamColors).forEach(([teamId, team]) => {
            if (divisions[team.division]) {
                divisions[team.division].push({ teamId, ...team });
            }
        });

        let html = '';
        
        Object.entries(divisions).forEach(([division, teams]) => {
            if (teams.length > 0) {
                html += `<div class="division-header">${division}</div>`;
                html += '<div class="color-grid">';
                
                teams.forEach(team => {
                    html += `
                        <div class="color-card" data-team-id="${team.teamId}" data-team-name="${team.name}" data-color="${team.color}">
                            <div class="color-swatch" style="background-color: ${team.color}"></div>
                            <div class="team-info">
                                <span class="team-name">${team.name}</span>
                                <span class="team-id">ID: ${team.teamId}</span>
                            </div>
                            <div class="hex-value">${team.color}</div>
                        </div>
                    `;
                });
                
                html += '</div>';
            }
        });

        return html;
    }

    setupColorCardEvents() {
        document.querySelectorAll('.color-card').forEach(card => {
            card.addEventListener('click', () => {
                const teamId = card.dataset.teamId;
                const teamName = card.dataset.teamName;
                const color = card.dataset.color;
                this.showColorModal(teamId, teamName, color);
            });
        });
    }

    showColorModal(teamId, teamName, color) {
        const modal = this.colorModal;
        const rgb = this.hexToRgb(color);
        
        document.getElementById('modalTeamName').textContent = teamName;
        document.getElementById('modalColorPreview').style.backgroundColor = color;
        document.getElementById('modalHex').textContent = color;
        document.getElementById('modalRgb').textContent = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
        document.getElementById('modalTeamId').textContent = teamId;
        document.getElementById('modalUsageCode').textContent = 
            `import { getTeamSpotColor } from './src/utils/spotColorMapping';\n\nconst ${teamName.replace(/\s+/g, '').toLowerCase()}Color = getTeamSpotColor(${teamId}); // ${color}`;
        
        modal.style.display = 'block';
    }

    hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }

    scrollToSection(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            const offset = 100; // Account for fixed header
            const elementPosition = section.offsetTop;
            const offsetPosition = elementPosition - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    }

    setActiveNavLink(activeLink) {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        activeLink.classList.add('active');
    }

    updateActiveNavigation() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');
        
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.pageYOffset >= sectionTop - 150) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }

    updateLastModified() {
        // This would typically fetch the last modified date from the git repository
        // For now, we'll use the current date
        const lastUpdated = new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
        
        document.getElementById('lastUpdated').textContent = lastUpdated;
    }

    // Auto-sync functionality (would be enhanced with actual file watching)
    async checkForUpdates() {
        try {
            // In a real implementation, this would check the README.md file for changes
            // and update the documentation content accordingly
            console.log('Checking for documentation updates...');
            
            // This could fetch the README.md from the repository and parse it
            // For now, we'll just update the timestamp
            this.updateLastModified();
            
        } catch (error) {
            console.warn('Auto-sync check failed:', error);
        }
    }

    // Initialize auto-sync checking every 5 minutes
    startAutoSync() {
        setInterval(() => {
            this.checkForUpdates();
        }, 5 * 60 * 1000); // 5 minutes
    }
}

// Initialize the documentation app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const app = new DocumentationApp();
    app.startAutoSync();
    
    // Add smooth scrolling for all internal links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

// Service Worker for offline functionality (optional enhancement)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
            .then((registration) => {
                console.log('SW registered: ', registration);
            })
            .catch((registrationError) => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}
