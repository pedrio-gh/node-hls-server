const hlsServer = require('../../lib/hlsServer');
const iptvSwitcher = require('../../lib/iptv_switcher');

hlsServer.run();
iptvSwitcher.loadIptv(`${__dirname}/iptv_procaja_12m1.m3u8`);

const getHlsSession = (chName) => {
  let session = hlsServer.hlsSessions.get(chName);

  if (!session) {
    const iptv = iptvSwitcher.getAvailableIptv();
    const channel = iptv.getChannels().find((c) => c.inf.title === chName);
    hlsServer.addStream(chName, channel.url);
    session = hlsServer.hlsSessions.get(chName);
    iptv.activate();
  }

  return session;
};

module.exports = {
  getHlsSession,
};
