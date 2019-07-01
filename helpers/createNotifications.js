import model from '../models';

const { notifications } = model;

/**
 * @description - This function takes care of creating notifications
 * @param {object} data - notfication data
 * @param {string} type - type of notification
 * @returns {object} created notification
 */
const createNotifications = async (data, typeofnotification) => {
  const { senderusername, receiverusername, id } = data;

  const createdNotifcation = await notifications.create({
    senderusername,
    receiverusername,
    content: data.message,
    typeofnotification,
    typeofnotificationid: id
  });

  return createdNotifcation;
};

export default createNotifications;
