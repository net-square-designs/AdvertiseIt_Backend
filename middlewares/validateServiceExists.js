/* eslint-disable import/no-cycle */
import { StatusResponse } from '../helpers';
import model from '../models';

const { services } = model;

const validateServiceExists = async (req, res, next) => {
  const { serviceId } = req.params;
  const returnedService = await services.findAndCountAll({
    where: {
      id: serviceId
    }
  });
  if (returnedService.count < 1) {
    StatusResponse.notfound(res, {
      status: 404,
      data: {
        message: 'Service not found'
      }
    });
  } else {
    return next();
  }
};

export default validateServiceExists;
