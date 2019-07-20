/* eslint-disable import/no-cycle */
// Helpers
import { StatusResponse } from '../helpers';

// This function validates that a url matches specified url
const validateSearchUrl = (req, res, next) => {
  const { query } = req.query;
  if (query === undefined) {
    StatusResponse.badRequest(res, {
      status: 400,
      data: {
        message: 'Invalid url, url should be like /search?query=',
      }
    });
  } else {
    return next();
  }
};

export default validateSearchUrl;
