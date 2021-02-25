const { Satellite, logger } = require('@senecacdot/satellite');
const Stats = require('./src/stats');

const service = new Satellite();

const statsRoute = (statsPeriod) => async (req, res) => {
  try {
    const data = await statsPeriod.calculate();
    res.json(data);
  } catch (err) {
    logger.error({ err }, 'Unable to get stats from database');
    res.status(503).json({
      message: 'Unable to get stats from database',
    });
  }
};

service.router.use('/today', statsRoute(Stats.today()));
service.router.use('/week', statsRoute(Stats.thisWeek()));
service.router.use('/month', statsRoute(Stats.thisMonth()));
service.router.use('/year', statsRoute(Stats.thisYear()));

const port = parseInt(process.env.STATS_PORT || 5555, 10);

service.start(port);
