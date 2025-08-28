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

// Главный эндпоинт для скрипта - ТОЧНАЯ КОПИЯ ВАШЕГО СКРИПТА
app.get('/api/script', validateRequest, (req, res) => {
    const scriptContent = `(function() {
    // Ваш точный скрипт
    function sendUserMessage(message) {
        try {
            var ChatUtility = Java.type("ru.nedan.neverapi.etc.ChatUtility");
            var TextBuilder = Java.type("ru.nedan.neverapi.etc.TextBuilder");
            var class_124 = Java.type("net.minecraft.class_124");
            
            ChatUtility.sendMessage(
                new TextBuilder()
                    .append(message)
                    .build()
            );
        } catch(e) {
            // Fallback to console if needed
            print("USER MESSAGE: " + message);
        }
    }

    // Send initialization message
    sendUserMessage("§eОбновлен: §c28.08.2025");
    sendUserMessage("§aДобавлено:");
    sendUserMessage("§9[\\\\] Перешли на новую защиту");
    sendUserMessage("§6§l---------------");
    sendUserMessage("§b§lУдачного пользования!");
    sendUserMessage("§b§l-Zr3");

    // Global variable to track if we're in the command sending process
    var isSendingCommands = false;

    on("ru.nedan.neverapi.event.impl.EventMessage", function(event) { 
        var message = event.getMessage();
        
        // Handle "[⚠] Данной команды не существует" message
        if (message.includes("[⚠] Данной команды не существует!")) {
            chat("/an604");
            return;
        }
        
        if (message === "Данная команда недоступна в режиме AFK" || message === "[⚠] Данной команды не существует!" && !isSendingCommands) { 
            isSendingCommands = true;
            
            // Send /hub command
            chat("/hub");
            
            // Wait 100ms and send /an command with the anarchy code
            java.lang.Thread.sleep(100);
            chat("/an604");
            
            // Reset the flag after a short delay
            java.lang.Thread.sleep(50);
            isSendingCommands = false;
        } 
    });

    // Alternative approach using repeat() function for periodic checking
    var afkDetected = false;

    on("ru.nedan.neverapi.event.impl.EventMessage", function(event) { 
        var message = event.getMessage();
        
        if (message === "Данная команда недоступна в режиме AFK") { 
            afkDetected = true;
        } 
    });

    // Check every 200ms if AFK was detected and send commands
    repeat(function() {
        if (afkDetected && !isSendingCommands) {
            isSendingCommands = true;
            afkDetected = false;
            
            // Send commands with 100ms delay
            chat("/hub");
            java.lang.Thread.sleep(100);
            chat("/an" + anarchy);
            
            isSendingCommands = false;
        }
    }, 200);
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

// ==================== ОБЩЕДОСТУПНЫЕ ЭНДПОИНТЫ ====================

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
