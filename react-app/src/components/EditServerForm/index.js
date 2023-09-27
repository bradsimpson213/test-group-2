import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { editServerThunk } from "../../store/servers";
import { useHistory } from "react-router-dom";

export const EditServerForm = () => {
  const sessionUser = useSelector((state) => state.session.user);
  const history = useHistory();
  const { server_id } = useParams();
  const [name, setName] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchServer = async () => {
      try {
        const response = await fetch(`/api/servers/${server_id}`);
        if (response.ok) {
          const data = await response.json();
          console.log("this is the old server data: ", data.server);
          if (data && data.server) {
            const oldServer = data.server;
            setName(oldServer.name);
            setImageUrl(oldServer.image_url);
            setIsPrivate(oldServer.private);
          }
        } else {
          console.log(server_id);
          throw new Error("failed to fetch server data");
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchServer();
  }, [server_id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const serverData = { name, image_url: imageUrl, private: isPrivate };

    const response = await dispatch(editServerThunk(server_id, serverData));

    if (response) {
      history.push(`/servers/${server_id}`);
    } else {
      console.error("Server update failed");
    }
  };

  return (
    <div>
      <h2>Edit your Server</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Server Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="image_url">Image URL:</label>
          <input
            type="text"
            id="image_url"
            name="image_url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="private">Private:</label>
          <input
            type="checkbox"
            id="private"
            name="private"
            checked={isPrivate}
            onChange={(e) => setIsPrivate(e.target.checked)}
          />
        </div>
        <button type="submit">Update Server</button>
      </form>
    </div>
  );
};

export default EditServerForm;
