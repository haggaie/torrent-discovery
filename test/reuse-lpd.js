var Discovery = require('../')
var Peers = require('Peers.js')
var hat = require('hat')
var test = require('tape')
var os = require('os')

var validatePeer = function (peer) {
  var interfaces = os.networkInterfaces(),
    ip = peer.split(':')[0],
    found = false

  Object.keys(interfaces).forEach(function (ifname) {
    interfaces[ifname].forEach(function (iface) {
      if ('IPv4' !== iface.family || iface.internal) {
        return
      }

      if (iface.address === ip) {
        found = true
        return
      }
    })
  })

  return found
}

test('re-use lpd, verify that peers are filtered', function (t) {
  var infoHash1 = hat(160)
  var infoHash2 = hat(160)

  var lpd = new Peers.Peers({
    'loopback' : true
  })
  lpd.listen()

  var discovery = new Discovery({
    peerId: hat(160),
    port: 6000,
    lpd: lpd
  })

  discovery.once('peer', function (addr) {
    t.assert(validatePeer(addr), 'peer is our own ip address')
    // Only peers for `infoHash1` should get emitted, none from `infoHash2`
    discovery.once('peer', function (addr) {
      t.equal('4.5.6.7', addr)

      discovery.stop(function () {
        lpd.stop(function () {
          t.end()
        })
      })
    })
    lpd.emit('peer', '2.3.4.5', infoHash2) // discovery should not emit this peer
    lpd.emit('peer', '3.4.5.6', infoHash2) // discovery should not emit this peer
    lpd.emit('peer', '4.5.6.7', infoHash1)
  })

  lpd.once('ready', function () {
    discovery.setTorrent(infoHash1)
  })
})
