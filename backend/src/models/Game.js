const db = require('../configs/db');

const Game = {
    updateScore: (userId, score, callback) => {
        db.query('UPDATE users SET score = score + ? WHERE id = ?', [score, userId], callback);
    },
    levelUp: (userId, callback) => {
        db.query('UPDATE users SET level = level + 1 WHERE id = ?', [userId], callback);
    },
    upgradeGun: (userId, callback) => {
        db.query('UPDATE users SET gun_level = gun_level + 1 WHERE id = ?', [userId], callback);
    }
};

module.exports = Game;
