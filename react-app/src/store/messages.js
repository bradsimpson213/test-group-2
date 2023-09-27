// Constants
const GET_MESSAGES = 'messages/GET_MESSAGES';
const SEND_MESSAGE = 'messages/SEND_MESSAGE';
const EDIT_MESSAGE = 'messages/EDIT_MESSAGE';
const DELETE_MESSAGE = 'messages/DELETE_MESSAGE';

// Action creators
const getChannelMessages = messages => ({
  type: GET_MESSAGES,
  messages
});


const sendMessage = message => ({
  type: SEND_MESSAGE,
  message
});


const editMessage = message => ({
  type: EDIT_MESSAGE,
  message
});


const deleteMessage = messageId => ({
  type: DELETE_MESSAGE,
  messageId
});


// Thunks


// Get all Messages for a Channel
export const getchannelMessagesThunk = channelId => async dispatch => {
  const res = await fetch(`/api/channels/${channelId}/messages`);
  const data = await res.json();
  console.log('CHANNEL MESSAGES FETCH RESPONSE:', data);
  dispatch(getChannelMessages(data));
  return data;
};


// Send a Message based on Channel id
export const sendMessageThunk = (channelId, data) => async dispatch => {
      console.log('SEND MESSAGE FETCH RESPONSE:', channelId, data);
  try {
    const res = await fetch(`/api/channels/${channelId}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    const message = res.json();
    // console.log('SEND MESSAGE FETCH RESPONSE:', message);
    dispatch(sendMessage(message));
    return message;
  }
  catch (error) {
    throw error;
  }
};


// Edit a Message based on its id
export const editMessageThunk = (messageId, data) => async dispatch => {
  try {
    const res = await fetch(`/api/messages/${messageId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    const message = await res.json();
    // console.log('EDIT MESSAGE FETCH RESPONSE:', message);
    dispatch(editMessage(message));
    return message;
  }
  catch (error) {
    throw error;
  };
};


// Delete a Message based on its id
export const deleteMessageThunk = messageId => async dispatch => {
  const res = await fetch(`/api/messages/${messageId}`, {
    method: "DELETE"
  });
  const data = await res.json();
  // console.log('DELETE MESSAGE FETCH RESPONSE:', message);
  dispatch(deleteMessage(messageId));
  return data;
};


// Message Reducer


// Initial State
const initialState = {};


export default function messagesReducer(state = initialState, action) {
  switch (action.type) {
    case GET_MESSAGES:
      const channelMessagesState = {};
      const { messages } = action.messages;
      messages.forEach(message => (
        channelMessagesState[message.id] = { ...message }
      ));
      return channelMessagesState;
    case SEND_MESSAGE:
      const sendState = { ...state, [action.message.id]: action.message };
      return sendState;
    case EDIT_MESSAGE:
      const editState = { ...state, [action.message.id]: action.message };
      return editState;
    case DELETE_MESSAGE:
      const deleteState = { ...state };
      delete deleteState[action.messageId];
      return deleteState
    default:
      return state;
  };
};
