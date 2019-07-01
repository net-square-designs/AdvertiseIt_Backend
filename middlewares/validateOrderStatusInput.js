// Helpers
import { StatusResponse } from '../helpers';

// This function validates input from a user
const validateOrderStatusInput = (req, res, next) => {
  const { status } = req.body;

  if (
    !status
  ) {
    StatusResponse.badRequest(res, {
      status: 400,
      data: {
        error: {
          status: !status ? 'status must be filled' : '',
        }
      }
    });
  } else if (status !== 'complete' && status !== 'incomplete') {
    StatusResponse.badRequest(res, {
      status: 400,
      data: {
        error: 'status must be complete or incomplete'
      }
    });
  } else {
    return next();
  }
};

export default validateOrderStatusInput;
