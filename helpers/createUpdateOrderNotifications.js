import model from '../models';

const { notifications } = model;

/**
 * @description - This function takes care of creating update order status notifications
 * @param {object} data - notfication data
 * @param {string} type - type of notification
 * @returns {object} created notification
 */
const createUpdateOrderNotifications = async (data, typeofnotification) => {
  const { customerusername, runnerusername, id } = data;

  const createdNotifcation = await notifications.create({
    senderusername: customerusername,
    receiverusername: runnerusername,
    content: `Order ${data.status}`,
    typeofnotification,
    typeofnotificationid: id
  });

  return createdNotifcation;
};

export default createUpdateOrderNotifications;
