/* eslint-disable import/no-cycle */
import ioClient from 'socket.io-client';
import socket from 'socket.io';
import { server, environment } from '../index';

/**
 * @description - This function takes care of triggering events
 * @param {object} payload - payload received from server
 * @param {string} type - type of event
 * @param {object} notification - payload that will be sent to the client
 * @returns {void}
 */
const triggerEvent = (payload, type, notification) => {
// Socket Server
  const io = socket(server);

  io.on('connection', (Socket) => {
    Socket.on(type, async () => {
      Socket.emit('notification_created', notification);
    });
  });

  // Socket Client
  let socketClient;
  if (environment === 'development') {
    socketClient = ioClient('http://localhost:3005');
  } else {
    socketClient = ioClient(`${process.env.URL_PROD}:${process.env.PORT || 3005}`);
  }
  if (payload !== undefined) {
    socketClient.emit(type, payload);
  }
/* To be created by the Front-End Engineer to populate notifications
 icon/page on the client(flutter app(ios/android)) */
  // socketClient.on('notification_created', (data) => {
  //   console.log(data, 'This is content of the notifications');
  // });
};

export default triggerEvent;
