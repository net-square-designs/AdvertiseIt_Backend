// Helpers
import { StatusResponse } from '../helpers';

// This function validates input from a user
const validateTaskStatusInput = (req, res, next) => {
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
  } else if (status !== 'accept' && status !== 'reject' && status !== 'finish') {
    StatusResponse.badRequest(res, {
      status: 400,
      data: {
        error: 'status must be accept, reject or finish'
      }
    });
  } else {
    return next();
  }
};

export default validateTaskStatusInput;
