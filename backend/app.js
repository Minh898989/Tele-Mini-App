const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');

const userRoutes = require('./src/routes/user.routes');
const gameRoutes = require('./src/routes/game.routes');
const missionRoutes = require('./src/routes/mission.routes');

app.use(cors({
  origin: 'http://localhost:3000',
  methods: 'GET,POST,PUT,DELETE',
  allowedHeaders: 'Content-Type,Authorization', 
}));


app.use(bodyParser.json());


app.use('/api/users', userRoutes);
app.use('/api/game', gameRoutes);
app.use('/api/missions', missionRoutes);


const PORT = 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
