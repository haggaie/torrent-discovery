var Discovery = require('../')
var DHT = require('bittorrent-dht')
var hat = require('hat')
var test = require('tape')
var Peers = require('Peers.js')

test('initialize with dht', function (t) {
  var dht = new DHT()
  var discovery = new Discovery({
    peerId: hat(160),
    port: 6000,
    dht: dht
  })
  discovery.stop(function () {
    dht.destroy(function () {
      t.end()
    })
  })
})

test('initialize with default dht', function (t) {
  var discovery = new Discovery({
    peerId: hat(160),
    port: 6000
  })
  discovery.stop(function () {
    t.end()
  })
})

test('initialize without dht', function (t) {
  var discovery = new Discovery({
    peerId: hat(160),
    port: 6000,
    dht: false
  })
  discovery.stop(function () {
    t.end()
  })
})

test('initialize with lpd', function (t) {
  var lpd = new Peers.Peers()
  var discovery = new Discovery({
      peerId: hat(160),
      port: 6000,
      lpd: lpd
    })
  discovery.stop(function () {
    lpd.stop(function () {
      t.end()
    })
  })
})

test('initialize with default lpd', function (t) {
  var discovery = new Discovery({
    peerId: hat(160),
    port: 6000,
    lpd: true
  })
  discovery.stop(function () {
    t.end()
  })
})

test('initialize without lpd', function (t) {
  var discovery = new Discovery({
    peerId: hat(160),
    port: 6000,
    lpd: false
  })
  discovery.stop(function () {
    t.end()
  })
})
