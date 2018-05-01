'use strict';

import geoip from 'geoip-lite';

function preRoute(req, res, next) {
     attachRequestStartTime(req);
     attachLocationInfo(req);
     next();
}

function attachRequestStartTime(req) {
     req.bookis = {start: Date.now()};
}

function attachLocationInfo(req) {
     const ip = getIp(req);
     const geo = geoip.lookup(ip);
     req.location = {ip, country: geo ? geo.country : ''};
}

function getIp(req) {
     let ipString = req.headers['x-forwarded-for'] || _.get(req, 'connection.remoteAddress') || _.get(req, 'socket.remoteAddress') || _.get(req, 'connection.socket.remoteAddress');
     if (ipString === '::1') return '127.0.0.1';
     if (!ipString) return 'unknown';
     let ips = ipString.split(', ');
     ips[0] = ips[0].replace('ffff:', '');
     ips[0] = ips[0].replace('::','');
     return ips[0];
}

export {
     preRoute
}
