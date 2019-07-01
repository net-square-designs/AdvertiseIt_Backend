/* eslint-disable import/no-cycle */
import Sequelize from 'sequelize';
import { StatusResponse } from '../helpers';
import model from '../models';

const { users } = model;
const { Op } = Sequelize;

// This function checks to see whether a user exist or not
const userExists = async (req, res, next) => {
  const { email, username } = req.body;
  const user = await users.findAndCountAll({
    where: {
      [Op.or]: [{ email }, { username }]
    },
  });

  if (user.count > 0) {
    StatusResponse.conflict(res, {
      status: 409,
      data: {
        error: 'User already exists, please sign up a new user',
      }
    });
  } else {
    return next();
  }
};

export default userExists;
