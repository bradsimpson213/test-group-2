import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as messageStore from "../../store/messages";
import './index.css'

export default function ChannelMessages() {
  const currentChannel = useSelector(state => state.channels.currentChannel);
  const messagesState = useSelector(state => state.messages);
  const dispatch = useDispatch();
  const messages = Object.values(messagesState);

  const [empty, setEmpty] = useState(true);

  useEffect(() => {
    dispatch(messageStore.getchannelMessagesThunk(currentChannel))
  }, [dispatch, currentChannel]);

  useEffect(() => {
    if (currentChannel && messages.length) {
      setEmpty(false)
    } else {
      setEmpty(true)
    };
  }, [currentChannel, messages])

  const channelData = (
    <div id="channel-messages-container">
      {messages.map((message) => (
        <div key={message.id} id="message-container">
          <p>{message.content}</p>
        </div>
      ))}
    </div>
  )

  const placeholder = (<h1>Message your friends here!</h1>)

  return (empty ? placeholder : channelData);
}
