import React, { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { authenticate } from "../../store/session";

import * as serverActions from "../../store/servers";

export default function PublicServers() {
  const dispatch = useDispatch();
  const allServers = useSelector((state) =>
    state.servers.allServers ? state.servers.allServers : {}
  );
  console.log("STATE:", allServers);
  const servers = Object.values(allServers);

  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(authenticate());
    dispatch(serverActions.getServersThunk()).then(() => setIsLoaded(true));
  }, [dispatch]);

  if (!isLoaded) return null;

  return (
    <div>
      <div className="main-container">
        {servers.map((server) => (
          <div key={server.id}>
            <h1>{server.name}</h1>
            <p>{server.private ? "Private" : "Public"}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
