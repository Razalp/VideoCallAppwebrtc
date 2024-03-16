class PeerService {
    peer: RTCPeerConnection | null;
    constructor() {
      this.peer = null;
      if (!this.peer) {
        this.peer = new RTCPeerConnection({
          iceServers: [
            {
              urls: [
                "stun:stun.l.google.com:19302",
                "stun:global.stun.twilio.com:3478",
              ],
            },
          ],
        });
      }
    }
  
    async getAnswer(offer: RTCSessionDescriptionInit): Promise<RTCSessionDescriptionInit | undefined> {
      if (this.peer) {
        await this.peer.setRemoteDescription(offer);
        const ans = await this.peer.createAnswer();
        await this.peer.setLocalDescription(ans);
        return ans;
      }
    }
  
    async setLocalDescription(ans: RTCSessionDescriptionInit): Promise<void> {
      if (this.peer) {
        await this.peer.setRemoteDescription(ans);
      }
    }
  
    async getOffer(): Promise<RTCSessionDescriptionInit | undefined> {
      if (this.peer) {
        const offer = await this.peer.createOffer();
        await this.peer.setLocalDescription(offer);
        return offer;
      }
    }
  }
  
  export default new PeerService();