import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as messageStore from "../../store/messages";
import { authenticate } from "../../store/session";
import './index.css'

export default function MessageForm() {
    const [message, setMessage] = useState('')
    const dispatch = useDispatch()
    const sessionUser = useSelector((state) => state.session.user);
    const allChannels = useSelector(state => (
        state.channels.allChannels ? state.channels.allChannels : {}
    ));
    const currentChannel = useSelector(state => (
        state.channels.currentChannel ? state.channels.currentChannel : null
    ));
    console.log('this is all channels', allChannels);

    let name

    let entries = Object.entries(allChannels)

    console.log('this is all the entries', entries);

    console.log('THIS IS THE CURRENT CHANNEL', currentChannel);
    for (const [key, value] of entries) {
        if (currentChannel === value['id']) {
            name = value['name']
            console.log('this is the name', name);
        }
    }
    const handleSubmit = async (e) => {
        e.preventDefault()
        const data = {
            content: message,
            owner_id: sessionUser.id
        }
     
        try {
            // Send the message
            await dispatch(authenticate());
            await dispatch(messageStore.sendMessageThunk(currentChannel, data));
    
            // Fetch the updated messages after sending the message
            await dispatch(messageStore.getchannelMessagesThunk(currentChannel));
        } catch (error) {
            // Handle any errors that occur during message sending or fetching
            console.error("Error sending message:", error);
        }
    }
    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input type="text" value={message}
                    onChange={e => setMessage(e.target.value)} placeholder={`Message #${name}`}></input>
            </form>
        </div>
    )
}
