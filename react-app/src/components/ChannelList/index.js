import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { authenticate } from "../../store/session";
import { NavLink } from "react-router-dom";
import * as channelStore from "../../store/channel";
import * as messageStore from "../../store/messages";


export default function ChannelBar() {
  const dispatch = useDispatch();

  // Select current user id from the store (dispatched by the navlink)
  const serverId = useSelector(state => (
    state.servers.currentServer ?
      state.servers.currentServer :
      null
  ));

  // Key into flattened server data for server properties
  const currentServer = useSelector(state => (
    state.servers.allServers[serverId] ?
      state.servers.allServers[serverId] :
      {}
  ));

  // Get all channels of the server from the store
  const allChannels = useSelector(state => (
    state.channels.allChannels ?
      state.channels.allChannels :
      {}
  ));
  const channels = Object.values(allChannels);

  // Dispatch get server channels fetch to the store
  useEffect(() => {
    dispatch(authenticate());
    dispatch(channelStore.getChannelsThunk(serverId));
  }, [dispatch, serverId]);

  // Add or replace current channel id in store property
  // then dispatch load messages by that channel's id
  const [channelId, setChannelId] = useState(null);

  const handleChannelClick = async channelId => {
    dispatch(channelStore.setCurrentChannelThunk(channelId))
      .then(dispatch(messageStore.getchannelMessagesThunk(channelId)))
      .then(() => setChannelId(channelId));
  };

  return (
    <div className="channels-bar-container">
      <div className="server-name">
        <h1>{currentServer.name}</h1>
      </div>
      <div className='channels-list-container'>
        {channels.map((channel) => (
          <NavLink
            key={channel.id}
            to='#'
            className='channel-navlinks'
            onClick={() => handleChannelClick(channel.id)}
          >
            <div key={channel.id}>
              <p>{channel.name}</p>
            </div>
          </NavLink>
        ))}
      </div>
    </div>
  );
}
