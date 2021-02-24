const POST = require('bent')('json', 'POST');
const iptvSwitcher = require('../../lib/iptv_switcher');

iptvSwitcher.loadIptv(`${__dirname}/iptv_procaja_1.m3u8`);
iptvSwitcher.loadIptv(`${__dirname}/iptv_gooi_12m1.m3u8`);
iptvSwitcher.loadIptv(`${__dirname}/iptv_gooi_12m2.m3u8`);
iptvSwitcher.loadIptv(`${__dirname}/iptv_gooi_12m3.m3u8`);

const sessions = [];

const proxies = [
  { id: 'proxy1', url: 'http://75.119.133.53', active: false },
  { id: 'proxy2', url: 'http://75.119.133.54', active: false },
];

const getHlsSession = async (chName) => {
  const session = sessions.find((s) => s.id === chName);

  if (!session) {
    const iptv = iptvSwitcher.getAvailableIptv();
    const channel = iptv.getChannels().find((c) => c.inf.title === chName);

    const proxy = proxies.find((p) => !p.active);

    const response = await POST(`${proxy}/start`, {
      id: chName,
      sourceUrl: channel.url,
    });

    if (response.ok) {
      proxy.active = true;
      sessions.push({ id: chName, url: `${proxy.url}/${chName}/index.m3u8` });
      iptv.activate();
    } else {
      throw new Error('Error starting proxy');
    }
  }

  return session;
};

const deleteHlsSession = (chName) => {
  const index = sessions.findIndex((session) => session.id === chName);
  sessions.splice(index, 1);
};

module.exports = {
  getHlsSession,
  deleteHlsSession,
};
