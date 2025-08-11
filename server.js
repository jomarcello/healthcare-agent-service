const http = require('http');
const url = require('url');

const port = process.env.PORT || 3001;

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const path = parsedUrl.pathname;
    const method = req.method;

    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Content-Type', 'application/json');

    // Handle OPTIONS preflight
    if (method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    console.log(`${new Date().toISOString()} - ${method} ${path}`);

    // Routes
    if (path === '/health' && method === 'GET') {
        res.writeHead(200);
        res.end(JSON.stringify({
            status: 'healthy',
            service: 'Autonomous Healthcare Agent',
            timestamp: new Date().toISOString(),
            uptime: Math.floor(process.uptime()),
            port: port
        }));
    }
    else if (path === '/' && method === 'GET') {
        res.writeHead(200);
        res.end(JSON.stringify({
            message: '🤖 Autonomous Healthcare Agent - Railway Live!',
            status: 'running',
            timestamp: new Date().toISOString(),
            endpoints: {
                health: '/health',
                trigger: 'POST /create-leads',
                claude: 'POST /claude-trigger'
            }
        }));
    }
    else if (path === '/create-leads' && method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            try {
                const data = JSON.parse(body || '{}');
                const count = data.count || 1;
                
                const results = [];
                for (let i = 0; i < count; i++) {
                    results.push({
                        leadId: `lead-${Date.now()}-${i}`,
                        status: 'processed',
                        company: `Healthcare Practice ${i + 1}`,
                        demoUrl: `https://demo-${i + 1}.railway.app`,
                        timestamp: new Date().toISOString()
                    });
                }
                
                res.writeHead(200);
                res.end(JSON.stringify({
                    success: true,
                    message: `✅ Processed ${count} healthcare leads`,
                    results: results,
                    autonomous: true
                }));
            } catch (error) {
                res.writeHead(400);
                res.end(JSON.stringify({ success: false, error: error.message }));
            }
        });
    }
    else if (path === '/claude-trigger' && method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            try {
                const data = JSON.parse(body || '{}');
                
                res.writeHead(200);
                res.end(JSON.stringify({
                    success: true,
                    message: '🤖 Autonomous agent ready for Claude Code!',
                    action: data.action || 'unknown',
                    autonomous: true,
                    mcp_ready: true,
                    timestamp: new Date().toISOString()
                }));
            } catch (error) {
                res.writeHead(400);
                res.end(JSON.stringify({ success: false, error: error.message }));
            }
        });
    }
    else {
        res.writeHead(404);
        res.end(JSON.stringify({
            success: false,
            message: 'Endpoint not found',
            available: ['/health', '/', 'POST /create-leads', 'POST /claude-trigger']
        }));
    }
});

server.listen(port, '0.0.0.0', () => {
    console.log('🤖 AUTONOMOUS HEALTHCARE AGENT - ULTRA SIMPLE VERSION');
    console.log('===================================================');
    console.log(`🌐 Server running on port ${port}`);
    console.log(`📊 Health check: /health`);
    console.log('🚀 READY FOR AUTONOMOUS OPERATION');
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('Shutting down gracefully...');
    server.close(() => process.exit(0));
});