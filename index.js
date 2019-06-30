const app = require('./src/routes/router');
const Logger = require('./logger');

const PORT = process.env.PORT || 3200;

app.listen(PORT, () => {
  Logger.success(`Listening on port ${PORT}`);
});
