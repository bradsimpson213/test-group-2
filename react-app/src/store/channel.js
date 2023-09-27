// Channel Consts

const GET_CHANNELS = "servers/GET_CHANNELS";
const POST_CHANNEL = "servers/POST_CHANNEL";
const EDIT_CHANNEL = "servers/EDIT_CHANNEL";
const DELETE_CHANNEL = "servers/DELETE_CHANNEL";
const CURRENT_CHANNEL = "servers/CURRENT_CHANNEL";


// Channel Actions
const getChannels = (channels) => ({
  type: GET_CHANNELS,
  channels,
});
export const postChannel = (channel) => ({
  type: POST_CHANNEL,
  channel,
});
export const editChannel = (channel) => ({
  type: EDIT_CHANNEL,
  channel,
});
export const deleteChannel = (channel) => ({
  type: DELETE_CHANNEL,
  channel,
});

const setCurrentChannel = channelId => ({
  type: CURRENT_CHANNEL,
  channelId
});

//Channel Thunks

// Get all Channels
export const getChannelsThunk = (serverId) => async (dispatch) => {
  const res = await fetch(`/api/servers/${serverId}/channels`);
  const data = await res.json();
  dispatch(getChannels(data));
  return data;
};

// Adding a new Channel based on serverId
export const postChannelThunk = (channel) => async (dispatch) => {
  const { name, serverId } = channel;
  const res = await fetch(`/api/servers/${serverId}/channels`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(name),
  });
};

//Edit a Channel based on its Id
export const editChannelThunk = (channel) => async (dispatch) => {
  const { name, id } = channel;
  console.log("name:", name);
  console.log("id:", id);
  const res = await fetch(`/api/channels/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(name),
  });

  const data = await res.json();
  dispatch(editChannel(data));
  return data;
};

//Delete Channel based on its Id
export const deleteChannelThunk = (channelId) => async (dispatch) => {
  const res = await fetch(`/api/channels/${channelId}`, {
    method: "DELETE",
  });
  const data = await res.json();
  dispatch(deleteChannel(channelId));
  return data;
};


// Set dashboard Channel by its id
export const setCurrentChannelThunk = channelId => async dispatch => {
  dispatch(setCurrentChannel(channelId));
};


// Channels Reducer

export default function reducer(state = {}, action) {
  switch (action.type) {
    case GET_CHANNELS: {
      let allChannels = {};
      const { channels } = action.channels;
      channels.forEach((channel) => (allChannels[channel.id] = { ...channel }));
      return { allChannels: { ...allChannels } };
    }
    case POST_CHANNEL: {
      return { ...state, [action.channel.id]: action.channel };
    }
    case EDIT_CHANNEL: {
      const newState = { ...state };
      newState[action.channel.id] = action.channel;
      return newState;
    }
    case DELETE_CHANNEL: {
      const deleteChannel = { ...state };
      delete deleteChannel[action.channelId];
      return deleteChannel;
    }
    case CURRENT_CHANNEL:
      const currentChannelState = {
        ...state,
        currentChannel: action.channelId
      };
      return currentChannelState;
    default:
      return state;
  }
}
