# Team Chat App 💬

**Jamoa uchun real-time chat ilovasi**

## Xususiyatlari ✨

- ✅ **Real-time Messaging** - Xabarlarni jonli ravishda yuborish va qabul qilish
- ✅ **Activity Log** - Kim nima qilgani haqida jonli yangilanish
- ✅ **User Profiles** - Har bir jamoa a'zosining ma'lumotlari
- ✅ **Online Status** - Foydalanuvchilarning holati (Online/Offline)
- ✅ **Responsive Design** - Mobil va desktop uchun optimallashtirilgan
- ✅ **User-friendly Interface** - Telegram-ga o'xshash interfeys

## Texnologiyalar 🛠

- **Frontend:** HTML5, CSS3, Vanilla JavaScript
- **Backend:** Node.js, Express
- **Real-time:** WebSocket (ws library)
- **Database:** In-memory (production uchun MongoDB tavsiya etiladi)

## O'rnatish 📦

### Frontend (sadbiy ishlatish)

```bash
# Fayllarni yuklab oling
git clone https://github.com/Sanjarbek191/team-chat-app.git
cd team-chat-app

# index.html ni brauzorda oching
open index.html
# yoki
start index.html
```

### Backend (Node.js server bilan)

```bash
# Paketlarni o'rnatish
npm install

# Serverni ishga tushirish
npm start

# Development mode (avtomat restart)
npm run dev
```

So'ng brauzeryni `http://localhost:3000` ga oching.

## Fayllar Tuzilishi 📁

```
team-chat-app/
├── index.html          # Asosiy HTML
├── style.css          # Barcha CSS
├── script.js          # Frontend JavaScript
├── server.js          # Express + WebSocket server
├── package.json       # NPM paketlari
└── README.md          # Bu fayl
```

## Ishlatish 🚀

### 1. Login
- Ismingiz va email-ni kiriting
- "Kiritish" tugmasini bosing

### 2. Chat
- Xabar yozing va yuboring
- Boshqa jamoa a'zolarini ko'ring
- Activity log'da hammasini kuzating

### 3. Profil
- Jamoa a'zosining nomiga bosing
- Uning ma'lumotlarini ko'ring

## API Endpoints 🔌

### WebSocket Events

```javascript
// Client -> Server
{
  type: 'register',
  userId: 123,
  name: 'Ali Rahimov',
  email: 'ali@example.com'
}

{
  type: 'message',
  userId: 123,
  userName: 'Ali Rahimov',
  text: 'Salom everyone!'
}

{
  type: 'activity',
  userName: 'Ali Rahimov',
  activityType: 'join',
  text: 'Ali Rahimov jamoa\'ga qo\'shildi'
}

// Server -> Client
{
  type: 'message',
  userId: 123,
  userName: 'Ali Rahimov',
  text: 'Salom everyone!',
  timestamp: '2024-06-02T10:30:00Z'
}

{
  type: 'activity',
  text: 'Ali Rahimov jamoa\'ga qo\'shildi',
  activityType: 'join'
}

{
  type: 'usersList',
  users: [
    { id: 123, name: 'Ali Rahimov', email: 'ali@example.com', isOnline: true },
    { id: 456, name: 'Shoxista', email: 'shoxista@example.com', isOnline: true }
  ]
}
```

## Features Detail 📝

### Real-time Messaging
- Xabarlar jonli ravishda barcha foydalanuvchilarga jo'natiladi
- Message history saqlanadi
- Timestamp bilan ko'rsatiladi

### Activity Tracking
- **Join** - Foydalanuvchi jamoa'ga qo'shildi
- **Leave** - Foydalanuvchi jamoa'dan chiqdi
- **Message** - Xabar yuborildi
- **Typing** - Birisi yozayotgan (future feature)

### User Status
- Online/Offline ko'rsatkichi
- Green dot - Online
- Gray dot - Offline

## Kelajakdagi Xususiyatlar 🔮

- [ ] Fayl yuklash
- [ ] Guruh yaratish
- [ ] Message editing
- [ ] Message deletion
- [ ] Emoji picker
- [ ] Voice messages
- [ ] Video calls
- [ ] Notifications
- [ ] Dark mode
- [ ] Uzbekcha interfeys

## Xatolarni Tuzatish 🐛

### WebSocket ulanmayotgan
```bash
# Package'larni qayta o'rnatish
rm -rf node_modules
npm install

# Portni tekshirish
lsof -i :3000
```

### Xabarlar ko'rinmayotgan
- Brauzerni refresh qiling
- Console'da xatoliklarni tekshiring (F12)

## Hissa Qo'shish 🤝

1. Repository'ni fork qiling
2. Feature branch yarating (`git checkout -b feature/AmazingFeature`)
3. O'zgarishlarga commit qiling (`git commit -m 'Add some AmazingFeature'`)
4. Branch'ga push qiling (`git push origin feature/AmazingFeature`)
5. Pull Request oching

## Litsenziya 📄

Bu loyiha MIT litsenziyasi ostida ruxsat berilgan.

## Muallif ✍️

**Sanjarbek191** - GitHub

## Aloqa 📧

Savollar yoki takliflar uchun issue oching yoki menga email yuboring.

---

**Shuning bilan! Happy coding! 🎉**
