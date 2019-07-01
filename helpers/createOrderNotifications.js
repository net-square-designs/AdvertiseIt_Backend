import model from '../models';

const { notifications } = model;

/**
 * @description - This function takes care of creating orders notifications
 * @param {object} data - notfication data
 * @param {string} type - type of notification
 * @returns {object} created notification
 */
const createOrderNotifications = async (data, typeofnotification) => {
  const { customerusername, runnerusername, id } = data;

  const createdNotifcation = await notifications.create({
    senderusername: customerusername,
    receiverusername: runnerusername,
    content: data.description,
    typeofnotification,
    typeofnotificationid: id
  });

  return createdNotifcation;
};

export default createOrderNotifications;
