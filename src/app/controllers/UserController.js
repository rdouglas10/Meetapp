import * as Yup from 'yup';
import User from '../models/User';

class UserController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().email().required(),
      password: Yup.string().required().min(6),
    });

    if (!(await schema.isValid(req.body))) {
      res.json({ error: 'Validation fails!' });
    }

    const userExist = await User.findOne({ where: { email: req.body.email } });

    if (!userExist) {
      res.json({ error: 'User already exists!' });
    }

    const user = await User.create(req.body);

    return res.json({ user });
  }

  async index(req, res) {
    const users = await User.findAll();

    if (!users) {
      res.json({ error: 'none users in database.' });
    } else {
      res.status(200).json({ users });
    }
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      oldPassword: Yup.string().min(6),
      password: Yup.string()
        .min(6)
        .when('oldPassword', (oldPassword, field) => (oldPassword ? field.required() : field)),
      confirmPassword: Yup.string().when('password', (password, field) => (password ? field.required().oneOf([Yup.ref('password')]) : field)),
    });

    if (!(await schema.isValid(req.body))) {
      return res.json({ error: 'Validation fails.' });
    }

    const { email, oldPassword } = req.body;

    const user = await User.findByPk(req.userId);

    if (user) {
      if (email !== user.email) {
        const userExist = await User.findOne({ where: { email } });
        if (userExist) {
          return res.status(400).json({ error: 'user alredy exists.' });
        }
      }

      if (oldPassword && !(await user.checkPassword(oldPassword))) {
        return res.status(401).json({ error: 'Password does not match.' });
      }

      // user.name = name;
      // user.save();

      const { id, name, provider } = await user.update(req.body);
      return res.status(200).json({
        id,
        name,
        email,
        provider,
      });
    }
    return res.status(401).json({ error: 'User not found' });
  }
}

export default new UserController();
