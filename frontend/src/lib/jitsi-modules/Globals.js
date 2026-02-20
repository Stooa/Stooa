/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

const connectionOptions = roomName => ({
  hosts: {
    domain: process.env.NEXT_PUBLIC_XMPP_DOMAIN,
    anonymousdomain: process.env.NEXT_PUBLIC_XMPP_GUEST_DOMAIN,
    authdomain: process.env.NEXT_PUBLIC_XMPP_AUTH_DOMAIN,
    muc: process.env.NEXT_PUBLIC_XMPP_MUC_DOMAIN
  },
  serviceUrl: `wss://${process.env.NEXT_PUBLIC_JITSI_HOST}/${process.env.NEXT_PUBLIC_JITSI_ROOM_PREFIX}xmpp-websocket?room=${roomName}`,
  websocketKeepAliveUrl: `https://${process.env.NEXT_PUBLIC_JITSI_HOST}/${process.env.NEXT_PUBLIC_JITSI_ROOM_PREFIX}_unlock?room=${roomName}`,
  deploymentInfo: {},
  flags: {
    ssrcRewritingEnabled: true
  }
});

const initOptions = { disableAudioLevels: true };
const roomOptions = {
  videoQuality: {
    preferredCodec: 'VP8'
  },
  p2p: {
    enabled: false,
    preferredCodec: 'VP8'
  }
};

export { connectionOptions, initOptions, roomOptions };
