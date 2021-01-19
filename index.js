const HLSServer = require('./hlsServer');

const server = new HLSServer();
server.run();

server.addStream('movistar_zero', 'http://portal-powerdns.club:8080/MMRb5hGc9T/2Hk1Sb205y/635');

console.log('test');
