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

// Главный эндпоинт для скрипта - ИСПРАВЛЕННАЯ ВЕРСИЯ
app.get('/api/script', validateRequest, (req, res) => {
    const scriptContent = `(function() {
    var username = Java.type("ru.nedan.spookybuy.Authentication").getUsername();

    // Проверяем разрешенные имена - ИСПРАВЛЕННЫЙ СПОСОБ
    var allowedUsers = [
        "porvaniy.gondon", "__ded_inside__", "latteld", "dofinixx", 
        "troll4", "zertqmap.org", "nekitpon", "fakepatrickstar", "inclodus"
    ];
    
    var isAllowed = false;
    for (var i = 0; i < allowedUsers.length; i++) {
        if (allowedUsers[i] === username) {
            isAllowed = true;
            break;
        }
    }
    
    if (isAllowed) {
        try {
            var anarchy = "604";
            var isSendingCommands = false;
            var afkDetected = false;

            // Первый обработчик события
            on("ru.nedan.neverapi.event.impl.EventMessage", function(event) { 
                var message = event.getMessage();
                if (message === "Данная команда недоступна в режиме AFK") { 
                    minecraft.field_1724.method_6043();
                }
            });

            // Второй обработчик события
            on("ru.nedan.neverapi.event.impl.EventMessage", function(event) { 
                var message = event.getMessage();
                
                if (message === "Данная команда недоступна в режиме AFK" && !isSendingCommands) { 
                    isSendingCommands = true;
                    
                    // Send /hub command
                    chat("/hub");
                    
                    // Wait 250ms and send /an command with the anarchy code
                    java.lang.Thread.sleep(250);
                    chat("/an" + anarchy);
                    
                    // Reset the flag after a short delay
                    java.lang.Thread.sleep(50);
                    isSendingCommands = false;
                } 
            });

            // Третий обработчик события
            on("ru.nedan.neverapi.event.impl.EventMessage", function(event) { 
                var message = event.getMessage();
                
                if (message === "[⚠] Данной команды не существует!") { 
                    afkDetected = true;
                } 
            });

            // Check every 200ms if AFK was detected and send commands
            repeat(function() {
                if (afkDetected && !isSendingCommands) {
                    isSendingCommands = true;
                    afkDetected = false;
                    
                    chat("/an" + anarchy);
                    
                    isSendingCommands = false;
                }
            }, 200);
            
        } catch (e) {
            java.lang.System.err.println("Ошибка при выполнении скрипта: " + e);
        }
    } else {
        java.lang.System.err.println("Ошибка: пользователь не авторизован - " + username);
    }
})();`;
    
    res.setHeader('Content-Type', 'application/javascript; charset=UTF-8');
    res.send(scriptContent);
});

// Эндпоинт для проверки статуса
app.get('/api/status', validateRequest, (req, res) => {
    res.json({ 
        status: 'online', 
        server: 'Secure Script Server',
        version: '1.0.0'
    });
});

// ==================== ОБЩЕДОСТУПНЫЕ ЭНдПОИНТЫ ====================

app.get('/', (req, res) => {
    res.json({
        service: 'Secure Script Delivery',
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
    console.log('✅ Server started on port', CONFIG.PORT);
});
