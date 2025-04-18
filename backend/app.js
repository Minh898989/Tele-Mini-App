const express = require('express');
const app = express();
const bodyParser = require('body-parser');

// Import Routes
const userRoutes = require('./src/routes/user.routes');
const gameRoutes = require('./src/routes/game.routes');
const missionRoutes = require('./src/routes/mission.routes');

app.use(bodyParser.json());

// API Routes
app.use('/api/users', userRoutes);
app.use('/api/game', gameRoutes);
app.use('/api/missions', missionRoutes);

// Server
const PORT = 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
