import React, { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { authenticate } from "../../store/session";
import * as serverActions from "../../store/servers";
import * as channelActions from '../../store/channel'
import "./ServersBar.css";

export default function ServersBar() {
  const dispatch = useDispatch();

  // Get servers from state
  const allServers = useSelector((state) =>
    state.servers.allServers ? state.servers.allServers : {}
  );
  const servers = Object.values(allServers);

  // Authenticate the user then fetch the servers list
  useEffect(() => {
    dispatch(authenticate())
      .then(dispatch(serverActions.getServersThunk()));
  }, [dispatch]);

  // Add or replace a current-server property in the store
  // then dump current-channel state
  const handleServerClick = async serverId => {
    dispatch(serverActions.setCurrentServerThunk(serverId))
      .then(dispatch(channelActions.setCurrentChannelThunk(null)));
  };

  return (
    <nav className="servers-container">

      {/* Home or eventual direct messages link */}

      <div className="logo-container">
        <NavLink to="/app">
          <img
            alt="discord"
            className="dis-logo"
            src="https://cdn.dribbble.com/userupload/5474438/file/original-c32ac002bd40c155894b9396d5d907db.jpg"
          />
        </NavLink>
      </div>

      <div className="seperator"></div>

      {/* Mapped server navlinks dispatch to store */}

      {servers.map((server) => (
        <div className="server-pics" key={server.id}>
          <NavLink
            to='#'
            onClick={() => handleServerClick(server.id)}
          >
            <img className="server-pic" src={server.image_url} />
          </NavLink>
        </div>
      ))}

      {/* Eventual open create-server modal link */}

      <div className="create-server">
        <NavLink to="servers/create">
          <img
            className="under-server-pic"
            src="https://images-na.ssl-images-amazon.com/images/S/influencer-profile-image-prod/logo/thebetterhave_1623197557096_original._CR0,0,4167,4167_._FMjpg_.png"
          />
        </NavLink>
      </div>

      {/* Eventual link to mount public servers list */}

      <div className="find-servers">
        <NavLink to="/servers">
          <img
            className="under-server-pic"
            src="https://sb.blackink.ai/storage/v1/object/public/creations/db78e901-3522-49ee-9b3a-25f0fd470268/0aaf6ab5-056b-4c06-9bd3-7fb594d7dcf3_0.webp"
          />
        </NavLink>
      </div>
    </nav>
  );
};
