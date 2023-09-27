from .auth_routes import validation_errors_to_error_messages
from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from app.socket import handle_add_channel, handle_edit_server, handle_delete_server, handle_add_server
from app.models import Channel, Server, User, db
from app.forms import ServerForm, ChannelForm
from app.routes.aws_helpers import (
    upload_file_to_s3, get_unique_filename)


server_routes = Blueprint('servers', __name__)

# Get all public servers
@server_routes.route('/', methods=['GET'])
@login_required
def get_all_servers():
    """
    Query a list of all servers not set to private
    """
    public_servers = Server.query.filter(Server.private == False).all()
    return {'servers': [server.to_dict() for server in public_servers]}


# Get details of server by id
@server_routes.route('/<int:server_id>', methods=['GET'])
def get_server_details(server_id):
    """
    Query a server's record by its id
    """
    server = Server.query.get(server_id)
    if server:
        server_data = server.to_dict()
        server_data['channels'] = [channel.to_dict() for channel in server.channels]
        return {'server': server_data}


#Get Channels for Server based on Server ID #
@server_routes.route('/<int:server_id>/channels')
@login_required
def server_channels(server_id):
    """
    Queries a list of all public channels in a server by server id
    """
    channels = Channel.query.filter(Channel.server_id == server_id).all()

    return {'channels': [channel.to_dict() for channel in channels]}


@server_routes.route('/<int:server_id>/channels', methods=['POST'])
@login_required
def create_channel(server_id):
    """
    Posts a new channel to a server by server id by an authorized user
    """
    server = Server.query.get(server_id)
    form = ChannelForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit() and server.owner_id == current_user.id:
        new_channel = Channel(
            name=form.data['name'],
            server_id=server_id
        )
        db.session.add(new_channel)
        db.session.commit()

        # Emit a Socket Event to notify clients about the new channel
        handle_add_channel(new_channel.to_dict())

        return new_channel.to_dict()
    else:
        errors = validation_errors_to_error_messages(form.errors)
        return {'errors': errors}, 400


# Create server
@server_routes.route('/', methods=['POST'])
@login_required
def create_server():
    """
    Posts a new server to the database by an authorized user
    """
    form = ServerForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():

        image_url=form.data["image_url"]
        image_url.filename = get_unique_filename(image_url.filename)
        upload = upload_file_to_s3(image_url)
        print("image upload", upload)

        if "url" not in upload:
        # if the dictionary doesn't have a url key
        # it means that there was an error when we tried to upload
        # so we send back that error message (and we printed it above)
            errors = [upload]
            return {'errors': errors}, 400

        url = upload["url"]

        new_server = Server(
            name=form.data["name"],
            image_url=url,
            private=form.data["private"],
            owner_id=current_user.id,
        )
        db.session.add(new_server)
        db.session.commit()

        # Emit a Socket Event to notify clients about the new server
        handle_add_server(new_server.to_dict())

        return new_server.to_dict()
    else:
        errors = validation_errors_to_error_messages(form.errors)
        return {'errors': errors}, 400


# Edit server
@server_routes.route('/<int:server_id>', methods=['PUT'])
@login_required
def edit_server(server_id):
    """
    Update a server by its ID by an authorized user
    """
    print('SERVER ID:', server_id)
    form = ServerForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    server = Server.query.get(server_id)

    if server is None:
        return {'errors': 'Server not found'}, 404

    if form.validate_on_submit() and server.owner_id == current_user.id:
        server.name = form.data['name']
        server.image_url = form.data['image_url']
        server.private = form.data['private']
        db.session.commit()

        # Emit a Socket Event to notify clients about the server edit
        handle_edit_server(server.to_dict())

        return server.to_dict()
    elif server.owner_id != current_user.id:
        return {'message': 'User unauthorized to edit server'}, 400
    else:
        errors = validation_errors_to_error_messages(form.errors)
        return {'errors': errors}, 400


# Delete a server based on id
@server_routes.route('/<int:server_id>', methods=['DELETE'])
@login_required
def delete_server(server_id):
    """
    Delete a server by its ID by an authorized user
    """
    server = Server.query.get(server_id)
    if not server:
        return { "message": "Server does not exist" }, 400
    if server.owner_id == current_user.id:
        handle_delete_server(server.to_dict())
        db.session.delete(server)
        db.session.commit()
        return { "message": "Server successfully deleted" }
    elif server.owner_id != current_user.id:
        return { "message": "Must server owner to delete" }, 400
    else:
        errors = validation_errors_to_error_messages(form.errors)
        return {'errors': errors}, 400
