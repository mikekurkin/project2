import os

from flask import Flask, jsonify, render_template
from flask_socketio import SocketIO, emit

app = Flask(__name__)
app.config["JSON_SORT_KEYS"] = False
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
socketio = SocketIO(app)

channels = []


@app.route("/")
def index():
    return render_template("index.html", channels=channels)


@socketio.on("create channel")
def name(data):
    channel = {}
    channel["id"] = len(channels) + 1
    channel["name"] = data["name"]
    channel["creator"] = data["creator"]
    channels.append(channel)
    emit("channel list", channels, broadcast=True)


@socketio.on("get channel list")
def get_channel_list(data):
    emit("channel list", channels, broadcast=True)


@socketio.on("get messages")
def get_messages(data):
    print(f"Should send messages for chat {data['id']}")
