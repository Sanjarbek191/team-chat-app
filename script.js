// ===== REGISTERED USERS DATABASE =====
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

// ===== APPLICATION STATE =====
const appState = {
    currentUser: null,
    users: [],
    messages: [],
    activities: [],
    socket: null,
    isConnected: false
};

// ===== ELEMENTS =====
const loginPage = document.getElementById('loginPage');
const chatPage = document.getElementById('chatPage');
const loginForm = document.getElementById('loginForm');
const usernameInput = document.getElementById('usernameInput');
const passwordInput = document.getElementById('passwordInput');
const messageForm = document.getElementById('messageForm');
const messageInput = document.getElementById('messageInput');
const messagesContainer = document.getElementById('messagesContainer');
const activityLog = document.getElementById('activityLog');
const membersList = document.getElementById('membersList');
const currentUserName = document.getElementById('currentUserName');
const onlineMembersCount = document.getElementById('onlineMembersCount');
const logoutBtn = document.getElementById('logoutBtn');

// ===== INITIALIZATION =====
window.addEventListener('DOMContentLoaded', () => {
    loginForm.addEventListener('submit', handleLogin);
    messageForm.addEventListener('submit', handleSendMessage);
    logoutBtn.addEventListener('click', handleLogout);
    
    // Simulating WebSocket connection
    initializeWebSocket();
});

// ===== LOGIN HANDLER =====
function handleLogin(e) {
    e.preventDefault();
    
    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();
    
    if (!username || !password) {
        alert('⚠️ Iltimos, foydalanuvchi nomi va parolni kiriting!');
        return;
    }
    
    // Check credentials
    const user = registeredUsers.find(u => u.username === username && u.password === password);
    
    if (!user) {
        alert('❌ Foydalanuvchi nomi yoki parol noto\'g\'ri!\n\nTo\'g\'ri ma\'lumotlarni tekshiring.');
        usernameInput.value = '';
        passwordInput.value = '';
        usernameInput.focus();
        return;
    }
    
    // Create current user
    appState.currentUser = {
        id: user.id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        joinedAt: new Date(),
        isOnline: true
    };
    
    // Add user to list if not already there
    const existingUser = appState.users.find(u => u.id === user.id);
    if (!existingUser) {
        appState.users.push(appState.currentUser);
    }
    
    // Add join activity
    addActivity(`${user.username} jamoa'ga qo'shildi`, 'join');
    
    // Switch to chat
    showChatPage();
}

// ===== SHOW CHAT PAGE =====
function showChatPage() {
    loginPage.classList.remove('active');
    chatPage.classList.add('active');
    
    currentUserName.textContent = appState.currentUser.username;
    updateMembersList();
    messageInput.focus();
}

// ===== WEBSOCKET SIMULATION =====
function initializeWebSocket() {
    // Simulating real-time events
    // In production, this would be actual WebSocket connection
    
    appState.isConnected = true;
    console.log('Connected to chat server');
}

// ===== MESSAGE HANDLERS =====
function handleSendMessage(e) {
    e.preventDefault();
    
    const text = messageInput.value.trim();
    
    if (!text) return;
    
    const message = {
        id: Date.now(),
        userId: appState.currentUser.id,
        userName: appState.currentUser.username,
        userAvatar: appState.currentUser.avatar,
        text: text,
        timestamp: new Date(),
        isOwn: true
    };
    
    appState.messages.push(message);
    displayMessage(message);
    
    // Add activity
    addActivity(`${appState.currentUser.username} xabar yubordi`, 'message');
    
    messageInput.value = '';
    messageInput.focus();
    scrollToBottom();
    
    // Simulate receiving message from another user after 2 seconds
    if (appState.users.length > 1) {
        setTimeout(() => simulateMessageFromOtherUser(text), 2000);
    }
}

// ===== DISPLAY MESSAGE =====
function displayMessage(message) {
    const messageEl = document.createElement('div');
    messageEl.className = `message ${message.isOwn ? 'own' : ''}`;
    
    const time = message.timestamp.toLocaleTimeString('uz-UZ', {
        hour: '2-digit',
        minute: '2-digit'
    });
    
    messageEl.innerHTML = `
        <div class="message-avatar">${message.userAvatar}</div>
        <div class="message-content">
            <div class="message-header">
                <span class="message-sender">${message.userName}</span>
                <span class="message-time">${time}</span>
            </div>
            <div class="message-bubble">${escapeHtml(message.text)}</div>
        </div>
    `;
    
    messagesContainer.appendChild(messageEl);
}

// ===== SIMULATE MESSAGE FROM OTHER USER =====
function simulateMessageFromOtherUser(replyTo) {
    const otherUsers = appState.users.filter(u => u.id !== appState.currentUser.id);
    if (otherUsers.length === 0) return;
    
    const randomUser = otherUsers[Math.floor(Math.random() * otherUsers.length)];
    
    const responses = [
        'Ha, men ham shunday fikrda bo\'laman!',
        'Ajoyib fikra!',
        'To\'g\'ri aytdingiz',
        'Xm, qiziqarli...',
        'Rozi! 👍',
        'Rahmat shaklini!',
        'Tushunaman 👌'
    ];
    
    const message = {
        id: Date.now(),
        userId: randomUser.id,
        userName: randomUser.username,
        userAvatar: randomUser.avatar,
        text: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date(),
        isOwn: false
    };
    
    appState.messages.push(message);
    displayMessage(message);
    addActivity(`${randomUser.username} xabar yubordi`, 'message');
    scrollToBottom();
}

// ===== ACTIVITY LOG =====
function addActivity(text, type = 'message') {
    const activity = {
        id: Date.now(),
        text: text,
        type: type,
        timestamp: new Date()
    };
    
    appState.activities.push(activity);
    displayActivity(activity);
}

function displayActivity(activity) {
    const activityEl = document.createElement('div');
    activityEl.className = `activity-item ${activity.type}`;
    
    const time = activity.timestamp.toLocaleTimeString('uz-UZ', {
        hour: '2-digit',
        minute: '2-digit'
    });
    
    const emoji = {
        'join': '📝',
        'leave': '👋',
        'message': '💬',
        'typing': '✏️'
    }[activity.type] || '📌';
    
    activityEl.innerHTML = `
        <div>${emoji} ${activity.text}</div>
        <div class="activity-time">${time}</div>
    `;
    
    activityLog.appendChild(activityEl);
    
    // Keep only last 10 activities
    if (appState.activities.length > 10) {
        activityLog.removeChild(activityLog.firstChild);
    }
}

// ===== MEMBERS LIST =====
function updateMembersList() {
    membersList.innerHTML = '';
    
    appState.users.forEach(user => {
        const memberEl = document.createElement('div');
        memberEl.className = `member-item ${user.id === appState.currentUser.id ? 'current' : ''}`;
        
        const status = user.isOnline ? 'online' : 'offline';
        
        memberEl.innerHTML = `
            <div class="status-indicator ${status}"></div>
            <div class="member-avatar">${user.avatar}</div>
            <div class="member-details">
                <div class="member-name">${user.username}</div>
                <div class="member-status">${user.isOnline ? '🟢 Online' : '⚪ Offline'}</div>
            </div>
        `;
        
        memberEl.addEventListener('click', () => showUserProfile(user));
        membersList.appendChild(memberEl);
    });
    
    updateOnlineCount();
}

// ===== UPDATE ONLINE COUNT =====
function updateOnlineCount() {
    const onlineCount = appState.users.filter(u => u.isOnline).length;
    onlineMembersCount.textContent = `${onlineCount} online`;
}

// ===== SHOW USER PROFILE =====
function showUserProfile(user) {
    alert(`
👤 ${user.username}
📧 ${user.email}
${user.isOnline ? '🟢 Online' : '⚪ Offline'}
⏰ Qo'shilgan vaqt: ${user.joinedAt.toLocaleString('uz-UZ')}
    `);
}

// ===== LOGOUT HANDLER =====
function handleLogout() {
    if (!confirm('Rostdan chiqmoqchisiz?')) return;
    
    const userName = appState.currentUser.username;
    addActivity(`${userName} jamoa'dan chiqdi`, 'leave');
    
    // Remove user from list
    appState.users = appState.users.filter(u => u.id !== appState.currentUser.id);
    
    appState.currentUser = null;
    appState.messages = [];
    appState.activities = [];
    
    loginPage.classList.add('active');
    chatPage.classList.remove('active');
    
    usernameInput.value = '';
    passwordInput.value = '';
    messagesContainer.innerHTML = '';
    activityLog.innerHTML = '';
    usernameInput.focus();
}

// ===== UTILITY FUNCTIONS =====
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

function scrollToBottom() {
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// ===== DEMO: AUTO ADD OTHER USER WHEN LOGGED IN =====
function initializeDemoTeam() {
    // Add the other registered user automatically
    const otherUser = registeredUsers.find(u => u.id !== appState.currentUser.id);
    if (otherUser && !appState.users.find(u => u.id === otherUser.id)) {
        const demoUser = {
            id: otherUser.id,
            username: otherUser.username,
            email: otherUser.email,
            avatar: otherUser.avatar,
            joinedAt: new Date(),
            isOnline: true
        };
        appState.users.push(demoUser);
        addActivity(`${otherUser.username} jamoa'ga qo'shildi`, 'join');
        updateMembersList();
    }
}

// Start demo when chat page loads
const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        if (chatPage.classList.contains('active')) {
            setTimeout(() => {
                initializeDemoTeam();
            }, 500);
            observer.disconnect();
        }
    });
});

observer.observe(chatPage, { attributes: true, attributeFilter: ['class'] });