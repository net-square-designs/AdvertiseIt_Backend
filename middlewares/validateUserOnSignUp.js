/* eslint-disable import/no-cycle */
// Packages
import emailvalidator from 'email-validator';
// Helpers
import { StatusResponse } from '../helpers';

// This function validates input from a user
const validateUserOnSignUp = (req, res, next) => {
  const {
    username, role, email, password
  } = req.body;

  if (
    !username
      || !email
      || !role
      || !password
  ) {
    StatusResponse.badRequest(res, {
      status: 400,
      data: {
        error: {
          email: !email ? 'email must be filled' : '',
          password: !password ? 'password must be filled' : '',
          username: !username ? 'username must be filled' : '',
          role: !role ? 'role must be filled' : '',
        }
      }
    });
  } else if (!emailvalidator.validate(email)) {
    StatusResponse.badRequest(res, {
      status: 400,
      data: {
        error: {
          email: 'Invalid email'
        },
      }
    });
  } else if (role !== 'runner' && role !== 'customer') {
    StatusResponse.badRequest(res, {
      status: 400,
      data: {
        error: 'role must be runner or customer'
      }
    });
  } else {
    return next();
  }
};

export default validateUserOnSignUp;
