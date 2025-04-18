const db = require('../configs/db');

const Mission = {
    completeMission: (userId, missionType, callback) => {
        db.query(
            'INSERT INTO missions (user_id, mission_type, completed_at) VALUES (?, ?, NOW())',
            [userId, missionType],
            callback
        );
    }
};

module.exports = Mission;
