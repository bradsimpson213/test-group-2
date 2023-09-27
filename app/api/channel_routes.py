from .auth_routes import validation_errors_to_error_messages
from flask import Blueprint, jsonify, session, request
from flask_login import login_required, current_user
from app.models import Server, Channel ,User, Message, db
from app.forms import ChannelForm, MessageForm
from app.socket import handle_add_channel, handle_delete_channel, handle_edit_channel, handle_add_message


channel_routes = Blueprint('channels', __name__)

# PUT Route for Editing a Channel based on its ID
@channel_routes.route('/<int:channel_id>', methods=['PUT'])
@login_required
def edit_channel(channel_id):
    """
    Updates the record of a channel by channel id by an authorized user
    """
    form = ChannelForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    channel = Channel.query.get(channel_id)
    server = Server.query.get(channel.server_id)

    if channel is None:
        return {'errors': 'Channel not found'}, 404

    if form.validate_on_submit() and server.owner_id == current_user.id:
        channel.name = form.data['name']
        channel.private = form.data['private']
        db.session.commit()
        handle_edit_channel(channel.to_dict())

        return channel.to_dict()

    return {'errors': validation_errors_to_error_messages(form.errors)}, 400

#Delete Channels based on Channels Id
@channel_routes.route('/<int:channel_id>', methods=['DELETE'])
@login_required
def delete_channel(channel_id):
    channel = Channel.query.get(channel_id)
    server = Server.query.get(channel.server_id)

    if not channel:
         return { "message": "Channel does not exist" }, 400
    if server.owner_id == current_user.id:
        handle_delete_channel(channel.to_dict())
        db.session.delete(channel)
        db.session.commit()
        return {"result": "Sucessfully Deleted Channel"}
    elif server.owner_id != current_user.id:
         return { "message": "Must server owner to delete" }, 400
    else:
        errors = validation_errors_to_error_messages(form.errors)
        return {"errors": errors}, 400


# Get all Messages of a Channel based on its ID
@channel_routes.route('/<int:channel_id>/messages', methods=['GET'])
@login_required
def get_channel_messages(channel_id):
    messages = Message.query.filter(Message.channel_id == channel_id).all()

    return {'messages': [message.to_dict() for message in messages]}


# Send a new Message in a Channel base on its ID by an authorized user
@channel_routes.route('/<int:channel_id>/messages', methods=['POST'])
@login_required
def send_message(channel_id):
    form = MessageForm()
    form['csrf_token'].data = request.cookies['csrf_token']

    if form.validate_on_submit():
        new_message = Message(
            content = form.data['content'],
            channel_id = channel_id,
            owner_id= current_user.id
        )
        db.session.add(new_message)
        db.session.commit()

        handle_add_message(new_message.to_dict(), channel_id) #Passing in Channel_id as argument(socket event)
        return new_message.to_dict()
    else:
        errors = validation_errors_to_error_messages(form.errors)
        return {"errors": errors}, 400
