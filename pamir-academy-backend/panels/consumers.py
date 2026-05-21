import json
from channels.generic.websocket import AsyncWebsocketConsumer


class SessionConsumer(AsyncWebsocketConsumer):
    """
    WebSocket consumer for WebRTC signaling.
    Relays SDP offers/answers and ICE candidates between peers in the same room.
    """

    async def connect(self):
        self.room_id = self.scope["url_route"]["kwargs"]["room_id"]
        self.room_group = f"session_{self.room_id}"

        await self.channel_layer.group_add(self.room_group, self.channel_name)
        await self.accept()

        # Notify existing peers that a new peer joined
        await self.channel_layer.group_send(self.room_group, {
            "type": "peer_joined",
            "channel": self.channel_name,
        })

    async def disconnect(self, code):
        await self.channel_layer.group_send(self.room_group, {
            "type": "peer_left",
            "channel": self.channel_name,
        })
        await self.channel_layer.group_discard(self.room_group, self.channel_name)

    async def receive(self, text_data):
        """Receive a signaling message and relay it to all other peers in the room."""
        data = json.loads(text_data)
        await self.channel_layer.group_send(self.room_group, {
            "type": "relay_message",
            "message": data,
            "sender_channel": self.channel_name,
        })

    async def relay_message(self, event):
        """Relay message to everyone except the sender."""
        if event["sender_channel"] != self.channel_name:
            await self.send(text_data=json.dumps(event["message"]))

    async def peer_joined(self, event):
        """Notify this peer that another peer has joined."""
        if event["channel"] != self.channel_name:
            await self.send(text_data=json.dumps({"type": "peer-joined"}))

    async def peer_left(self, event):
        """Notify this peer that another peer has left."""
        if event["channel"] != self.channel_name:
            await self.send(text_data=json.dumps({"type": "peer-left"}))
