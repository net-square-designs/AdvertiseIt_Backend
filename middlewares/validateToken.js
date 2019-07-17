/* eslint-disable import/no-cycle */
import jwt from 'jsonwebtoken';
import { StatusResponse } from '../helpers';

// This function validates that a token is supplied and valid
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
    try {
      const decoded = jwt.verify(authorization, process.env.SECRET_KEY);
      req.decoded = decoded;
      return next();
    } catch (error) {
      StatusResponse.unauthorized(res, {
        status: 401,
        data: {
          error: 'Unauthorized, user not authenticated'
        }
      });
    }
  }
};

export default validateToken;
