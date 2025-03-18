import { Model, DataTypes } from 'sequelize';
import sequelize from '../index.js';

class FollowedEvents extends Model {
  static associate(models) {
    // define association here
  }
}

FollowedEvents.init(
  {
    id: DataTypes.STRING,
    user: DataTypes.STRING,
    event: DataTypes.STRING
  },
  {
    sequelize,
    modelName: 'FollowedEvents'
  }
);

export default FollowedEvents;
