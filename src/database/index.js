import Sequelize from 'sequelize';
import mongoose from 'mongoose';
import databaseConfig from '../config/database';
import User from '../app/models/User';
import File from '../app/models/File';
import Appointment from '../app/models/Appointment';

const models = [User, File, Appointment];

class Database {
    constructor() {
        this.init();
        this.mongo();
    }

    init() {
        this.connection = new Sequelize(databaseConfig);
        this.connection.authenticate().then(() => {
            // eslint-disable-next-line no-console
            console.log('Postgres connected successfully');
        });
        models.map((model) => model.init(this.connection));
        models.map(
            (model) =>
                model.associate && model.associate(this.connection.models),
        );
    }

    mongo() {
        this.mongoConnection = mongoose
            .connect('mongodb://localhost:27017/gobarber', {
                useNewUrlParser: true,
                useFindAndModify: true,
                useUnifiedTopology: true,
            })
            .then(() => {
                // eslint-disable-next-line no-console
                console.log('Mongodb connected successfully');
            });
    }
}

export default new Database();
