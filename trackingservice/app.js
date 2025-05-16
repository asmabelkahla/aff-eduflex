const express = require('express');
const app = express();
const trackingRoutes = require('./routes/tracking');

app.use(express.json());
app.use('/api/tracking', trackingRoutes);

const PORT = 3002;
app.listen(PORT, () => console.log(`TrackingService en ligne sur http://localhost:${PORT}`));
