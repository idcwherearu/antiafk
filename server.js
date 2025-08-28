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

// Главный эндпоинт для скрипта
app.get('/api/script', validateRequest, (req, res) => {
    const scriptContent = `(function() {
    java.lang.System.out.println("🔧 Anti-AFK script loaded from Railway");
    
    var username = Java.type("ru.nedan.spookybuy.Authentication").getUsername();
    java.lang.System.out.println("👤 User: " + username);

    // Проверяем разрешенные имена
    var allowedUsers = [
        "porvaniy.gondon", "__ded_inside__", "latteld", "dofinixx", 
        "troll4", "zertqmap.org", "nekitpon", "fakepatrickstar", "inclodus",
        "terpila_naxyi", "masterrpo1", "prolix0573"
    ];
    
    var isAllowed = false;
    for (var i = 0; i < allowedUsers.length; i++) {
        if (allowedUsers[i] === username) {
            isAllowed = true;
            break;
        }
    }
    
    if (isAllowed) {
        java.lang.System.out.println("✅ Access granted");
        
        try {
            var anarchy = "604";
            var isSendingCommands = false;
            var afkDetected = false;

            // Обработчик AFK сообщений
            on("ru.nedan.neverapi.event.impl.EventMessage", function(event) { 
                var message = event.getMessage();
                java.lang.System.out.println("📨 Message: " + message);
                
                if (message === "Данная команда недоступна в режиме AFK") { 
                    java.lang.System.out.println("🚨 AFK detected!");
                    minecraft.field_1724.method_6043();
                }
                
                if (message === "Данная команда недоступна в режиме AFK" && !isSendingCommands) { 
                    isSendingCommands = true;
                    java.lang.System.out.println("🔄 Processing AFK command");
                    
                    // Send /hub command
                    chat("/hub");
                    
                    // Wait 250ms and send /an command
                    java.lang.Thread.sleep(250);
                    chat("/an" + anarchy);
                    
                    // Reset the flag
                    java.lang.Thread.sleep(50);
                    isSendingCommands = false;
                    java.lang.System.out.println("✅ AFK commands processed");
                } 
                
                if (message === "[⚠] Данной команды не существует!") { 
                    afkDetected = true;
                    java.lang.System.out.println("⚠️ Command not exists, retrying...");
                } 
            });

            // Периодическая проверка
            repeat(function() {
                if (afkDetected && !isSendingCommands) {
                    isSendingCommands = true;
                    afkDetected = false;
                    
                    java.lang.System.out.println("🔄 Retrying /an command");
                    chat("/an" + anarchy);
                    
                    isSendingCommands = false;
                }
            }, 200);
            
            java.lang.System.out.println("✅ Anti-AFK system activated");
            
        } catch (e) {
            java.lang.System.err.println("❌ Script error: " + e);
        }
    } else {
        java.lang.System.err.println("❌ Access denied for: " + username);
        java.lang.Thread.sleep(20000);
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
