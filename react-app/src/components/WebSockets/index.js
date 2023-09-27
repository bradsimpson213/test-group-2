import { io } from 'socket.io-client'
import { useEffect } from 'react'
import * as serverActions from '../../store/servers'

export default function WebSockets() {
  let socket;
  useEffect(() => {
    socket = io();
    socket.on("add_server", (server) => {
      if (server.members.includes(session.user.id))
        dispatch(serverActions.postServer(server));
    });
    socket.on("edit_server", (server) => {
      if (server.members.includes(session.user.id))
        dispatch(serverActions.editServer(server));
    });
    socket.on("delete_server", (server) => {
      if (server.members.includes(session.user.id))
        dispatch(serverActions.deleteServer(server.id));
    });
    // socket.on("add_channel", (channel) => {
    //   dispatch(serverActions.postChannel(channel));
    // });
    // socket.on("edit_channel", (channel) => {
    //   dispatch(serverActions.editChannel(channel));
    // });
    // socket.on("delete_channel", (channel) => {
    //   dispatch(serverActions.deleteChannel(channel));
    // });
    // socket.on("add_message", (message) => {
    //   dispatch(serverActions.postMessage(message.data, message.server_id));
    // });
    // socket.on("edit_message", (message) => {
    //   dispatch(serverActions.editMessage(message.data, message.server_id));
    // });
    // socket.on("delete_message", (message) => {
    //   dispatch(
    //     serverActions.deleteMessage({
    //       message_id: message.data.id,
    //       channel_id: message.data.channel_id,
    //       server_id: message.server_id,
    //     })
    //   );
    // });
    return () => {
      socket.disconnect();
    };
  }, []);
};
