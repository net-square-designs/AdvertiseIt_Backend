/* eslint-disable import/no-cycle */
// Helpers
import { StatusResponse } from '../helpers';

// This function validates input from a user
const validateProductsInput = (req, res, next) => {
  const {
    tags, title, price, description, media, category
  } = req.body;

  if (
    !media
      || !category
      || !tags
      || !title
      || !price
      || !description
  ) {
    StatusResponse.badRequest(res, {
      status: 400,
      data: {
        error: {
          category: !category ? 'category must be filled' : '',
          tags: !tags ? 'tags must be filled' : '',
          description: !description ? 'description must be filled' : '',
          title: !title ? 'title must be filled' : '',
          price: !price ? 'price must be filled' : '',
          media: !media ? 'media to deliver must be filled' : ''
        }
      }
    });
  } else if (!Number(price)) {
    StatusResponse.badRequest(res, {
      status: 400,
      data: {
        error: {
          price: 'price must be a number'
        },
      }
    });
  } else if (!Array.isArray(tags)) {
    StatusResponse.badRequest(res, {
      status: 401,
      data: {
        error: {
          tags: 'tags is not an array'
        }
      }
    });
  } else {
    return next();
  }
};

export default validateProductsInput;
