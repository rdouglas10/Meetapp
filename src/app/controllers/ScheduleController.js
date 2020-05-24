import Sequelize from 'sequelize';
import User from '../models/User';
import Appointment from '../models/Appointment';

const { Op } = Sequelize;

class ScheduleController {
  async index(req, res) {
    const checkProvider = await User.findOne({
      where: {
        id: req.userId,
        provider: true,
      },
    });

    if (!checkProvider) {
      return res.status(401).json({ error: 'User not is a provider' });
    }

    const { date } = req.query;

    const appointments = await Appointment.findAll({
      where: { provider_id: req.userId, date: { [Op.gte]: date } },
      attributes: ['id', 'date'],
      include: [
        { model: User, attributes: ['id', 'name'], as: 'user' },
        { model: User, attributes: ['id', 'name'], as: 'provider' },
      ],
    });

    return res.json(appointments);
  }
}

export default new ScheduleController();
