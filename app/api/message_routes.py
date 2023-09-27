from .auth_routes import validation_errors_to_error_messages
from flask import Blueprint, jsonify, session, request
from flask_login import login_required, current_user
from app.models import Server, Channel, Message, User, db
from app.forms import MessageForm
from app.socket import handle_add_message, handle_delete_message, handle_edit_message


message_routes = Blueprint('messages', __name__)


# Edit a Message based on its ID by an authorized user
@message_routes.route('/<int:message_id>', methods=['PUT'])
@login_required
def edit_message(message_id):
  """
    Updates a record of a message by its id by an authorized user
  """
  form = MessageForm()
  form['csrf_token'].data = request.cookies['csrf_token']
  message = Message.query.get(message_id)

  if message is None:
    return { "error": "Message not found" }, 404

  channel = Channel.query.get(message.channel_id)

  if message.owner_id != current_user.id:
    return { "error": "Must be author to edit a message" }, 400

  if form.validate_on_submit() and message.owner_id == current_user.id:
    message.content = form.data['content']
    db.session.commit()

    handle_edit_message(message.to_dict(), channel.id)

    return message.to_dict()

  return {'errors': validation_errors_to_error_messages(form.errors)}, 400


# Delete a message by its id by an authorized user
@message_routes.route('/<int:message_id>', methods=['DELETE'])
@login_required
def delete_message(message_id):
  """
  Updates a record of a message by its id by an authorized user
  """
  message = Message.query.get(message_id)

  if not message:
    return { "message": "Message does not exist" }, 400

  channel = Channel.query.get(message.channel_id)

  if message.owner_id == current_user.id:

    # Socket
    handle_delete_message(message.to_dict(), channel.id)

    db.session.delete(message)
    db.session.commit()
    return { "message": "Message deleted" }
  else:
    return { "error": "Must be author to delete a message" }, 400
