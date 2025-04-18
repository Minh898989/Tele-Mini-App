const Mission = require('../models/Mission');

exports.completeMission = (req, res) => {
    const { userId, missionType } = req.body;

    if (!userId || !missionType) {
        return res.status(400).send('Missing userId or missionType');
    }

    Mission.completeMission(userId, missionType, (err, result) => {
        if (err) return res.status(500).send(err);
        res.send('Mission completed');
    });
};