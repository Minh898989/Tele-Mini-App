const axios = require('axios');
const User = require('../models/User');
const { TELEGRAM_API_URL } = require('../configs/tele'); // ← import file config

exports.login = (req, res) => {
    const { telegramId } = req.body;
    
    if (!telegramId) return res.status(400).send('Missing telegramId');

    User.findOrCreate(telegramId, async (err, user) => {
        if (err) return res.status(500).send(err);

        // Gửi tin nhắn Telegram trực tiếp
        try {
            await axios.post(`${TELEGRAM_API_URL}/sendMessage`, {
                chat_id: telegramId,
                text: '🎮 Chào mừng bạn đến với Game Bắn Gà!',
            });
        } catch (error) {
            console.error('Lỗi gửi Telegram:', error.response?.data || error.message);
        }

        res.json(user);
    });
};
