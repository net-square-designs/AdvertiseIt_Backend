/* eslint-disable import/no-cycle */
// Helpers
import { StatusResponse } from '../helpers';

// This function validates input from a user
const validateOrdersInput = (req, res, next) => {
  const {
    category, title, budget, quantity, description, duedate, deliverylocation
  } = req.body;

  const isDate = (new Date(duedate)).getDate();

  if (
    !category
      || !budget
      || !title
      || !quantity
      || !description
      || !duedate
      || !deliverylocation
  ) {
    StatusResponse.badRequest(res, {
      status: 400,
      data: {
        error: {
          title: !title ? 'title must be filled' : '',
          description: !description ? 'description must be filled' : '',
          category: !category ? 'category must be filled' : '',
          quantity: !quantity ? 'quantity must be filled' : '',
          budget: !budget ? 'budget must be filled' : '',
          duedate: !duedate ? 'due date must be filled' : '',
          deliverylocation: !deliverylocation ? 'delivery location must be filled' : ''
        }
      }
    });
  } else if (!Number(quantity) || !Number(budget)) {
    StatusResponse.badRequest(res, {
      status: 400,
      data: {
        error: {
          quantity: !Number(quantity) ? 'quantity must be a number' : '',
          budget: !Number(budget) ? 'budget must be a number' : '',
        },
      }
    });
  } else if (!isDate) {
    StatusResponse.badRequest(res, {
      status: 400,
      data: {
        error: {
          duedate: !isDate ? 'due date must be a date and should follow the format YY-MM-DD' : ''
        },
      }
    });
  } else {
    return next();
  }
};

export default validateOrdersInput;
