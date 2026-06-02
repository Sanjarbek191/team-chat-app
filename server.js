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

// WebSocket connection handler
wss.on('connection', (ws) => {
    console.log('New client connected');
    
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
        // Remove user from users map
        let disconnectedUser = null;
        clients.forEach((client, userId) => {
            if (client === ws) {
                disconnectedUser = userId;
                clients.delete(userId);
            }
        });
        
        // Broadcast user offline status
        if (disconnectedUser) {
            const user = users.get(disconnectedUser);
            if (user) {
                broadcastMessage({
                    type: 'activity',
                    text: `${user.name} chiqdi`,
                    activityType: 'leave'
                });
            }
        }
    });
});

function handleUserRegister(ws, message) {
    const { userId, name, email } = message;
    
    const user = {
        id: userId,
        name: name,
        email: email,
        joinedAt: new Date(),
        isOnline: true
    };
    
    users.set(userId, user);
    clients.set(userId, ws);
    
    // Broadcast user joined
    broadcastMessage({
        type: 'activity',
        text: `${name} jamoa'ga qo'shildi`,
        activityType: 'join'
    });
    
    // Send current users list
    broadcastMessage({
        type: 'usersList',
        users: Array.from(users.values())
    });
}

function handleMessage(ws, message) {
    const { userId, userName, text } = message;
    
    // Broadcast message to all clients
    broadcastMessage({
        type: 'message',
        userId: userId,
        userName: userName,
        text: text,
        timestamp: new Date()
    });
}

function handleActivity(ws, message) {
    const { userName, activityType, text } = message;
    
    broadcastMessage({
        type: 'activity',
        text: text,
        activityType: activityType
    });
}

function broadcastMessage(message) {
    const data = JSON.stringify(message);
    clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(data);
        }
    });
}

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Team Chat Server running on http://localhost:${PORT}`);
});