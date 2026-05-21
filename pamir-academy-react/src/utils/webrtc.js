/**
 * WebRTC helper utilities for peer-to-peer video/audio/screen-sharing.
 */

const ICE_SERVERS = [
  { urls: "stun:stun.l.google.com:19302" },
  { urls: "stun:stun1.l.google.com:19302" },
];

/**
 * Create a new RTCPeerConnection with event handlers.
 * @param {Function} onTrack - called with remote MediaStream when a track arrives
 * @param {Function} onIceCandidate - called with each ICE candidate to send via signaling
 * @returns {RTCPeerConnection}
 */
export function createPeerConnection(onTrack, onIceCandidate) {
  const pc = new RTCPeerConnection({ iceServers: ICE_SERVERS });

  pc.ontrack = (event) => {
    if (event.streams && event.streams[0]) {
      onTrack(event.streams[0]);
    }
  };

  pc.onicecandidate = (event) => {
    if (event.candidate) {
      onIceCandidate(event.candidate);
    }
  };

  return pc;
}

/**
 * Get local camera + microphone stream.
 */
export async function getLocalStream(video = true, audio = true) {
  return navigator.mediaDevices.getUserMedia({ video, audio });
}

/**
 * Get screen-sharing stream.
 */
export async function getScreenStream() {
  return navigator.mediaDevices.getDisplayMedia({
    video: { cursor: "always" },
    audio: true,
  });
}

/**
 * Replace a track (e.g., swap camera -> screen share) on an existing peer connection.
 * @param {RTCPeerConnection} pc
 * @param {MediaStreamTrack} newTrack
 * @param {"video"|"audio"} kind
 */
export function replaceTrack(pc, newTrack, kind = "video") {
  const sender = pc.getSenders().find((s) => s.track?.kind === kind);
  if (sender) {
    sender.replaceTrack(newTrack);
  }
}
