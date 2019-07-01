/* eslint-disable import/no-cycle */
// Helpers
import { StatusResponse } from '../helpers';

// This function validates that a token is supplied
const validateToken = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    StatusResponse.badRequest(res, {
      status: 400,
      data: {
        error: {
          token: !authorization ? 'No token provided, please provide one' : '',
        }
      }
    });
  } else {
    return next();
  }
};

export default validateToken;
