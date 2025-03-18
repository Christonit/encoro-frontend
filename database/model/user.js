import { Model, DataTypes } from 'sequelize';
import connection from '../connection';
import Events from './event'; // import the Events model

const initUsers = (sequelize, Types) => {
    class Users extends Model { }
    Users.init(
        {
            id: { type: Types.UUID, primaryKey: true },
            name: Types.STRING,
            email: Types.STRING,
            image: Types.STRING,
            is_business: Types.BOOLEAN,
            phone_number: Types.STRING,
            contact_email: Types.STRING,
            username: Types.STRING,
            biography: Types.TEXT('long'),
            location: Types.STRING,
            place_id: Types.STRING,
            schedule: Types.TEXT,
            social_networks: Types.TEXT,
            business_picture: Types.STRING,
            google_id: {
                type: DataTypes.TEXT,
                unique: true,
                allowNull: true,

            },
            facebook_id: {
                type: DataTypes.TEXT,
                unique: true,
                allowNull: true,

            },

        },
        {
            sequelize,
            paranoid: false,
            timestamps: true,
            modelName: 'Users',
            tableName: 'users',
            // createdAt: 'created_at',
            // updatedAt: 'updated_at',
            // deletedAt: 'deleted_at',

        }
    );
    Users.associate = (models) => {
        Users.hasMany(models.Events, { foreignKey: 'creator' });
    };
    Users.associate = (models) => {
        Users.hasMany(models.FollowedEvents, { foreignKey: 'event' });
    };


    return Users;
};

export default initUsers(connection, DataTypes);