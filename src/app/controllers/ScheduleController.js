import { startOfDay, endOfDay, parseISO } from 'date-fns';
import { Op } from 'sequelize';
import Appointment from '../models/Appointment';
import User from '../models/User';

class ScheduleController {
    async index(req, res) {
        const checkUserProvider = await User.findOne({
            where: {
                id: req.userId,
                provider: true,
            },
        });

        if (!checkUserProvider) {
            return res.status(401).json({ error: 'User is not a provider' });
        }

        const { date } = req.query;

        /**
         * check if query date exists
         */
        if (!date) {
            return res.status(401).json({ error: 'query date is required' });
        }

        const parsedDate = parseISO(date);

        const appointments = await Appointment.findAll({
            where: {
                provider_id: req.userId,
                canceled_at: null,
                date: {
                    [Op.between]: [
                        startOfDay(parsedDate),
                        endOfDay(parsedDate),
                    ],
                },
            },
            order: ['date'],
        });
        return res.json(appointments);
    }
}

export default new ScheduleController();
