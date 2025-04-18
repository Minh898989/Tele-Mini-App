const db = require('../configs/db');

const User = {
    findOrCreate: (telegramId, callback) => {
        db.query('SELECT * FROM users WHERE telegram_id = ?', [telegramId], (err, results) => {
            if (err) return callback(err);
            if (results.length > 0) return callback(null, results[0]);
            db.query('INSERT INTO users (telegram_id) VALUES (?)', [telegramId], (err, result) => {
                if (err) return callback(err);
                callback(null, { id: result.insertId, telegram_id: telegramId });
            });
        });
    },

    findById: (id, callback) => {
        db.query('SELECT * FROM users WHERE id = ?', [id], (err, results) => {
            if (err) return callback(err);
            callback(null, results[0]);
        });
    },

    
};

module.exports = User;
