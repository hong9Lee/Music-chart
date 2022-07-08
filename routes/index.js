const musicController = require('./musicController');

module.exports = app => {
  app.use('/music-chart', musicController);
}
