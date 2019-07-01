import model from '../models';

const { notifications } = model;

/**
 * @description - This function takes care of creating update task status notifications
 * @param {object} data - notfication data
 * @param {string} type - type of notification
 * @returns {object} created notification
 */
const createUpdateTaskNotifications = async (data, typeofnotification) => {
  const { customerusername, runnerusername, id } = data;

  const createdNotifcation = await notifications.create({
    senderusername: runnerusername,
    receiverusername: customerusername,
    content: `I have ${data.status}ed this task`,
    typeofnotification,
    typeofnotificationid: id
  });

  return createdNotifcation;
};

export default createUpdateTaskNotifications;
