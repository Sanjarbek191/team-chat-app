// Simple Express server for Team Chat App
// To run: node server.js
// Then open http://localhost:3000

const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Serve static files
app.use(express.static(path.join(__dirname)));

// Store connected clients
const clients = new Map();
const users = new Map();

// Pre-registered users
const registeredUsers = [
    {
        id: 1,
        username: 'Sensus',
        password: '1234',
        email: 'sensus@company.com',
        avatar: '👨‍💼'
    },
    {
        id: 2,
        username: 'Humoyun',
        password: '1234',
        email: 'humoyun@company.com',
        avatar: '👨'
    }
];

// Auto-login Humoyun when server starts
let humoyunAutoJoined = false;

// WebSocket connection handler
wss.on('connection', (ws) => {
    console.log('New client connected');
    
    // Auto-login Humoyun on first connection
    if (!humoyunAutoJoined && wss.clients.size === 1) {
        setTimeout(() => {
            const humoyun = registeredUsers.find(u => u.username === 'Humoyun');
            if (humoyun && !users.has(humoyun.id)) {
                const humoyunData = {
                    id: humoyun.id,
                    username: humoyun.username,
                    email: humoyun.email,
                    avatar: humoyun.avatar,
                    joinedAt: new Date(),
                    isOnline: true
                };
                
                users.set(humoyun.id, humoyunData);
                console.log(`✅ ${humoyun.username} avtomatik kirdi!`);
                
                // Broadcast to all clients that Humoyun joined
                broadcastMessage({
                    type: 'activity',
                    text: `${humoyun.username} jamoa'ga qo'shildi`,
                    activityType: 'join'
                });
                
                // Send updated users list
                broadcastMessage({
                    type: 'usersList',
                    users: Array.from(users.values())
                });
                
                humoyunAutoJoined = true;
            }
        }, 500);
    }
    
    ws.on('message', (data) => {
        try {
            const message = JSON.parse(data);
            
            switch (message.type) {
                case 'register':
                    handleUserRegister(ws, message);
                    break;
                case 'message':
                    handleMessage(ws, message);
                    break;
                case 'activity':
                    handleActivity(ws, message);
                    break;
            }
        } catch (err) {
            console.error('Error processing message:', err);
        }
    });
    
    ws.on('close', () => {
        console.log('Client disconnected');
        let disconnectedUser = null;
        clients.forEach((client, userId) => {
            if (client === ws) {
                disconnectedUser = userId;
                clients.delete(userId);
            }
        });
        
        if (disconnectedUser) {
            const user = users.get(disconnectedUser);
            if (user && user.username !== 'Humoyun') {
                broadcastMessage({
                    type: 'activity',
                    text: `${user.username} chiqdi`,
                    activityType: 'leave'
                });
            }
        }
    });
});

function handleUserRegister(ws, message) {
    const { userId, username, password } = message;
    
    // Verify credentials
    const registeredUser = registeredUsers.find(u => u.id === userId && u.username === username && u.password === password);
    
    if (!registeredUser) {
        ws.send(JSON.stringify({ type: 'error', message: 'Invalid credentials' }));
        return;
    }
    
    const user = {
        id: userId,
        username: username,
        email: registeredUser.email,
        avatar: registeredUser.avatar,
        joinedAt: new Date(),
        isOnline: true
    };
    
    users.set(userId, user);
    clients.set(userId, ws);
    
    console.log(`✅ ${username} kirdi`);
    
    // Broadcast user joined
    broadcastMessage({
        type: 'activity',
        text: `${username} jamoa'ga qo'shildi`,
        activityType: 'join'
    });
    
    // Send current users list
    broadcastMessage({
        type: 'usersList',
        users: Array.from(users.values())
    });
    
    // Auto-add other user if not present
    if (users.size === 1) {
        setTimeout(() => {
            const otherUser = registeredUsers.find(u => u.id !== userId);
            if (otherUser && !users.has(otherUser.id)) {
                const otherUserData = {
                    id: otherUser.id,
                    username: otherUser.username,
                    email: otherUser.email,
                    avatar: otherUser.avatar,
                    joinedAt: new Date(),
                    isOnline: true
                };
                
                users.set(otherUser.id, otherUserData);
                console.log(`✅ ${otherUser.username} avtomatik kirdi!`);
                
                broadcastMessage({
                    type: 'activity',
                    text: `${otherUser.username} jamoa'ga qo'shildi`,
                    activityType: 'join'
                });
                
                broadcastMessage({
                    type: 'usersList',
                    users: Array.from(users.values())
                });
            }
        }, 500);
    }
}

function handleMessage(ws, message) {
    const { userId, username, text } = message;
    
    console.log(`💬 ${username}: ${text}`);
    
    // Broadcast message to all clients
    broadcastMessage({
        type: 'message',
        userId: userId,
        username: username,
        text: text,
        timestamp: new Date()
    });
}

function handleActivity(ws, message) {
    const { username, activityType, text } = message;
    
    broadcastMessage({
        type: 'activity',
        text: text,
        activityType: activityType
    });
}

function broadcastMessage(message) {
    const data = JSON.stringify(message);
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(data);
        }
    });
}

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`\n🚀 Team Chat Server running on http://localhost:${PORT}`);
    console.log(`📱 Telefonda kirish: http://192.168.X.XXX:${PORT}`);
    console.log(`\n✅ Sensus va Humoyun avtomatik kiradi!\n`);
});