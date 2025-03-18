import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import SequelizeAdapter, { models } from "@next-auth/sequelize-adapter";
import { Sequelize, DataTypes } from "sequelize";
import config from '@/database/config.mjs';
// https://sequelize.org/master/manual/getting-started.html#connecting-to-a-database
const sequelize = new Sequelize(config)


const User = sequelize.define("user", {
    ...models.User,
    is_business: DataTypes.BOOLEAN,
    role: DataTypes.STRING,
    phone_number: DataTypes.STRING,
    social_networks: DataTypes.STRING,
    contact_email: DataTypes.STRING,
    username: DataTypes.STRING,
    biography: DataTypes.STRING,
    location: DataTypes.STRING,
    schedule: DataTypes.STRING,
    business_picture: DataTypes.STRING,
    schedule: DataTypes.STRING,
    place_id: DataTypes.STRING,
    google_id: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: true,
    },
    facebook_id: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: true,
    },
});

const options = {

    providers: [
        FacebookProvider({
            clientId: process.env.FACEBOOK_CLIENT_ID,
            clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
            allowDangerousEmailAccountLinking: true,
            scope: 'email,public_profile,business_management',
            // ,instagram_basic,instagram_content_publish',
            fields: ['id', 'email', 'name', 'picture.type(large)', 'business'],
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            allowDangerousEmailAccountLinking: true
        })
    ],
    pages: {
        signIn: '/login/',
    },

    adapter: SequelizeAdapter(sequelize, {
        models: {
            User
        },

    }),
    callbacks: {

        async signIn({ user, account, profile, email, credentials }) {
            try {


                // TODO: Facebook signin between non shared email providers is not sending the email. Ex: loging in with my .alesan@gmail on facebook returns the email but .satn@@outlook dont
                // console.log(0, { user, account, profile, email, credentials });
                // let existingUser = await User.findOne({ where: { email: user.email } });

                // console.log(1, { existingUser, account });
                // if (existingUser) {

                //     console.log(2, { existingUser }, `${account.provider}_id`);

                //     if (account.provider === 'google' && !existingUser.googleId) {
                //         console.log(2.25, { account });

                //         await existingUser.update({ google_id: account.providerAccountId });
                //     } else if (account.provider === 'facebook' && !existingUser.facebookId) {
                //         console.log(2.5, { account });

                //         await existingUser.update({ facebook_id: account.providerAccountId });
                //     }
                // }
                return true;

            } catch (error) {
                console.error(error);
            }

        },
        //TODO: IMplementing the jwt callback did not work, token and account where being undefined
        async session({ session, user }) {

            try {


                const { access_token, refresh_token } = await sequelize.models.account.findOne({ where: { user_id: user.id } });
                const { name, id, email, phone_number, contact_email, social_networks, image, schedule, biography, username, location, business_picture, role } = user;
                session.user = { name, username, id, email, contact_email, phone_number, biography, location, business_picture, social_networks: JSON.parse(social_networks), image, schedule: JSON.parse(schedule), is_business: user.is_business, role }
                return { ...session, access_token, refresh_token };

            } catch (error) {
                console.error(error);
            }

        }
    }
};

export const authOptions = {
    callbacks: options.callbacks,
};

// eslint-disable-next-line import/no-anonymous-default-export
export default (req, res) => NextAuth(req, res, options);