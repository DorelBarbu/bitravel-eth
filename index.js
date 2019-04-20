const app = require('./src/routes/router');
const Logger = require('./logger');

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  Logger.success(`Listening on port ${PORT}`);
});
