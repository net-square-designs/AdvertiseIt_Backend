/* eslint-disable import/no-cycle */
import { StatusResponse } from '../helpers';
import model from '../models';

const { users } = model;

const validateUsersProfileExists = async (req, res, next) => {
  const { username } = req.params;
  const returnedUser = await users.findAndCountAll({
    where: {
      username
    }
  });
  if (returnedUser.count < 1) {
    StatusResponse.notfound(res, {
      status: 404,
      data: {
        message: "User's profile not found",
        profile: {}
      }
    });
  } else {
    req.returnedUser = returnedUser;
    return next();
  }
};

export default validateUsersProfileExists;
