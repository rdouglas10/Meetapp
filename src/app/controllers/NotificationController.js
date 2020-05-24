import Notification from '../schemas/Notification';
import User from '../models/User';

class NotificationController {
  async index(req, res) {
    const checkIdProvider = await User.findOne({ where: { id: req.userId, provider: true } });

    if (!checkIdProvider) {
      return res.status(401).json({ error: 'Only providres can load notifications' });
    }

    const notifications = await Notification.find({
      user: req.userId,
    })
      .sort('createdAt')
      .limit(20);

    return res.json(notifications);
  }

  async update(req, res) {
    // const notification = await Notification.findById(req.params.id);

    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true },
    );

    return res.json(notification);
  }
}

export default new NotificationController();
