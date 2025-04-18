const Game = require('../models/Game');

exports.updateScore = (req, res) => {
    const { userId, score } = req.body;
    Game.updateScore(userId, score, (err, result) => {
        if (err) return res.status(500).send(err);
        res.send('Score updated');
    });
};

exports.levelUp = (req, res) => {
    const { userId } = req.body;
    Game.levelUp(userId, (err, result) => {
        if (err) return res.status(500).send(err);
        res.send('Level up successful');
    });
};

exports.upgradeGun = (req, res) => {
    const { userId } = req.body;
    Game.upgradeGun(userId, (err, result) => {
        if (err) return res.status(500).send(err);
        res.send('Gun upgraded');
    });
};
