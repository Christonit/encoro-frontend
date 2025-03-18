import { Model, DataTypes } from 'sequelize';
import connection from '../connection';
import Users from './user';

const initEvents = (sequelize, Types) => {
    class Events extends Model { }
    Events.init(
        {
            id: { type: Types.STRING, primaryKey: true },
            direction: Types.STRING,
            city: Types.STRING,
            place_id: Types.STRING,
            category: Types.STRING,
            secondary_category: Types.STRING,
            title: Types.STRING,
            date: Types.DATE,
            time: Types.TIME,
            description: Types.TEXT('long'),
            hashtags: Types.JSON,
            media: Types.JSON,
            entrance_format: Types.STRING,
            ticket_link: Types.STRING,
            fee: Types.BIGINT,
            creator: Types.STRING,
            social_networks: Types.STRING,
            published_in_ig: Types.BOOLEAN,
            is_active: Types.BOOLEAN,
        },
        {
            sequelize,
            paranoid: false,
            timestamps: true,
            modelName: 'Events',
            tableName: 'events',
            createdAt: 'created_at',
            updatedAt: 'updated_at',
            deletedAt: 'deleted_at',

        }
    );

    Events.associate = (models) => {
        Events.belongsTo(models.Users, { foreignKey: 'creator' }); // define the relationship
    };
    Events.prototype.getCreator = async function () {
        const creator = await this.getCreator();
        return creator;
    };
    return Events;
};


export default initEvents(connection, DataTypes);