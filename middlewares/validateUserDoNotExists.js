/* eslint-disable import/no-cycle */
import { StatusResponse } from '../helpers';
import model from '../models';

const { users } = model;

// This function checks to see whether a user exist or not
const validateUserDoNotExists = async (req, res, next) => {
  const { email, username } = req.body;
  let key;
  let value;
  if (email) {
    key = 'email';
    value = email;
  } else {
    key = 'username';
    value = username;
  }
  const user = await users.findAndCountAll({
    where: {
      [key]: value
    },
  });

  if (user.count < 1) {
    StatusResponse.notfound(res, {
      status: 404,
      data: {
        error: 'User not found, please register user onto the platform',
      }
    });
  } else {
    return next();
  }
};

export default validateUserDoNotExists;
