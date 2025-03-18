import pg from 'pg';

export default {

    "username": process.env.DB_USERNAME,
    "password": process.env.DB_PASSWORD,
    "database": process.env.DB_NAME,
    "host": process.env.DB_HOSTNAME,
    "port": process.env.DB_PORT,
    "dialect": 'postgres',
    "dialectModule": pg,
    "protocol": 'postgres',
    "dialectOptions": {
        "ssl": {
            "require": true,
            "rejectUnauthorized": false // For Heroku's self-signed certificate
        }
    }

}