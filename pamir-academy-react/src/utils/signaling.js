/**
 * WebSocket signaling client for WebRTC session negotiation.
 */

const WS_BASE = (() => {
  const env = import.meta.env.VITE_WS_BASE_URL;
  if (env) return env + "/ws/session/";
  const proto = window.location.protocol === "https:" ? "wss:" : "ws:";
  return `${proto}//${window.location.host}/ws/session/`;
})();

/**
 * Connect to the signaling server for a specific room.
 * @param {string} roomId - UUID of the live session room
 * @param {Function} onMessage - callback invoked with parsed JSON for each incoming message
 * @returns {{ send: Function, close: Function, ws: WebSocket }}
 */
export function connectSignaling(roomId, onMessage) {
  const ws = new WebSocket(`${WS_BASE}${roomId}/`);

  ws.onopen = () => console.log("[Signaling] Connected to room:", roomId);
  ws.onmessage = (event) => onMessage(JSON.parse(event.data));
  ws.onerror = (err) => console.error("[Signaling] WebSocket error:", err);
  ws.onclose = () => console.log("[Signaling] Connection closed");

  return {
    send: (data) => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(data));
      }
    },
    close: () => ws.close(),
    ws,
  };
}
