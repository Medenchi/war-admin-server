const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const BOT_TOKEN = 'YOUR_TELEGRAM_BOT_TOKEN';
const CHAT_ID = 'YOUR_CHAT_ID';

let currentCode = null;

// Генерация и отправка кода в Telegram
app.post('/send-code', async (req, res) => {
    const { code } = req.body;
    currentCode = code;

    try {
        await axios.get(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            params: {
                chat_id: CHAT_ID,
                text: `🔐 Код доступа к админке: ${code}`
            }
        });
        return res.json({ status: "ok" });
    } catch (err) {
        console.error("Ошибка отправки в Telegram", err);
        return res.status(500).json({ error: "Не удалось отправить код" });
    }
});

// Проверка кода
app.post('/verify-code', (req, res) => {
    const { code } = req.body;
    if (code === currentCode) {
        currentCode = null;
        return res.json({ success: true });
    }
    return res.json({ success: false });
});

// Запуск сервера
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
});
