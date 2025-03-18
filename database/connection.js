import Sequelize from 'sequelize';
import config from './config.mjs';

let sequelize;
sequelize = new Sequelize(config);
// } else if (process.env.NODE_ENV === 'staging') {
//   sequelize = new Sequelize(config.staging);
// } else if (process.env.NODE_ENV === 'test') {
//   sequelize = new Sequelize(config.test);


const connection = sequelize;

export default connection;