/* global describe, it, expect, jest, jasmine */
import React from 'react';
import { WatchOnlyWallet, LegacyWallet, SegwitP2SHWallet, AppStorage } from './class';
import renderer from 'react-test-renderer';
import Settings from './screen/settings';
import Selftest from './screen/selftest';
import { BlueHeader } from './BlueComponents';
import MockStorage from './MockStorage';
let assert = require('assert');
jest.mock('react-native-qrcode', () => 'Video');
const AsyncStorage = new MockStorage();
jest.setMock('AsyncStorage', AsyncStorage);
jest.useFakeTimers();
jest.mock('Picker', () => {
  // eslint-disable-next-line import/no-unresolved
  const React = require('React');
  const PropTypes = require('prop-types');
  return class MockPicker extends React.Component {
    static Item = props => React.createElement('Item', props, props.children);
    static propTypes = { children: PropTypes.any };
    static defaultProps = { children: '' };

    render() {
      return React.createElement('Picker', this.props, this.props.children);
    }
  };
});

describe('unit - LegacyWallet', function() {
  it('serialize and unserialize work correctly', () => {
    let a = new LegacyWallet();
    a.setLabel('my1');
    let key = JSON.stringify(a);

    let b = LegacyWallet.fromJson(key);
    assert(key === JSON.stringify(b));

    assert.equal(key, JSON.stringify(b));
  });

  it('can validate addresses', () => {
    let w = new LegacyWallet();
    assert.ok(w.isAddressValid('12eQ9m4sgAwTSQoNXkRABKhCXCsjm2jdVG'));
    assert.ok(!w.isAddressValid('12eQ9m4sgAwTSQoNXkRABKhCXCsjm2j'));
    assert.ok(w.isAddressValid('3BDsBDxDimYgNZzsqszNZobqQq3yeUoJf2'));
    assert.ok(!w.isAddressValid('3BDsBDxDimYgNZzsqszNZobqQq3yeUo'));
    assert.ok(!w.isAddressValid('12345'));
  });
});

it('BlueHeader works', () => {
  const rendered = renderer.create(<BlueHeader />).toJSON();
  expect(rendered).toBeTruthy();
});

it('Settings work', () => {
  const rendered = renderer.create(<Settings />).toJSON();
  expect(rendered).toBeTruthy();
});

it('Selftest work', () => {
  const component = renderer.create(<Selftest />);
  const root = component.root;
  const rendered = component.toJSON();
  expect(rendered).toBeTruthy();
  // console.log((root.findAllByType('Text')[0].props));

  let okFound = false;
  let allTests = [];
  for (var v of root.findAllByType('Text')) {
    let text = v.props.children;
    if (text.join) {
      text = text.join('');
    }
    if (text === 'OK') {
      okFound = true;
    }
    allTests.push(text);
    // console.log(text);
  }

  assert.ok(okFound, 'OK not found. Got: ' + allTests.join('; '));
});

it('Appstorage - loadFromDisk works', async () => {
  AsyncStorage.storageCache = {}; // cleanup from other tests
  /** @type {AppStorage} */
  let Storage = new AppStorage();
  let w = new SegwitP2SHWallet();
  w.setLabel('testlabel');
  w.generate();
  Storage.wallets.push(w);
  await Storage.saveToDisk();

  // saved, now trying to load

  let Storage2 = new AppStorage();
  await Storage2.loadFromDisk();
  assert.equal(Storage2.wallets.length, 1);
  assert.equal(Storage2.wallets[0].getLabel(), 'testlabel');
  let isEncrypted = await Storage2.storageIsEncrypted();
  assert.ok(!isEncrypted);

  // emulating encrypted storage (and testing flag)

  AsyncStorage.storageCache.data = false;
  AsyncStorage.storageCache.data_encrypted = '1'; // flag
  let Storage3 = new AppStorage();
  isEncrypted = await Storage3.storageIsEncrypted();
  assert.ok(isEncrypted);
});

it('Appstorage - encryptStorage & load encrypted storage works', async () => {
  AsyncStorage.storageCache = {}; // cleanup from other tests

  /** @type {AppStorage} */
  let Storage = new AppStorage();
  let w = new SegwitP2SHWallet();
  w.setLabel('testlabel');
  w.generate();
  Storage.wallets.push(w);
  await Storage.saveToDisk();
  let isEncrypted = await Storage.storageIsEncrypted();
  assert.ok(!isEncrypted);
  await Storage.encryptStorage('password');
  isEncrypted = await Storage.storageIsEncrypted();
  assert.equal(Storage.cachedPassword, 'password');
  assert.ok(isEncrypted);

  // saved, now trying to load, using good password

  let Storage2 = new AppStorage();
  isEncrypted = await Storage2.storageIsEncrypted();
  assert.ok(isEncrypted);
  let loadResult = await Storage2.loadFromDisk('password');
  assert.ok(loadResult);
  assert.equal(Storage2.wallets.length, 1);
  assert.equal(Storage2.wallets[0].getLabel(), 'testlabel');

  // now trying to load, using bad password

  Storage2 = new AppStorage();
  isEncrypted = await Storage2.storageIsEncrypted();
  assert.ok(isEncrypted);
  loadResult = await Storage2.loadFromDisk('passwordBAD');
  assert.ok(!loadResult);
  assert.equal(Storage2.wallets.length, 0);

  // now, trying case with adding data after decrypt.
  // saveToDisk should be handled correctly

  Storage2 = new AppStorage();
  isEncrypted = await Storage2.storageIsEncrypted();
  assert.ok(isEncrypted);
  loadResult = await Storage2.loadFromDisk('password');
  assert.ok(loadResult);
  assert.equal(Storage2.wallets.length, 1);
  assert.equal(Storage2.wallets[0].getLabel(), 'testlabel');
  w = new SegwitP2SHWallet();
  w.setLabel('testlabel2');
  w.generate();
  Storage2.wallets.push(w);
  assert.equal(Storage2.wallets.length, 2);
  assert.equal(Storage2.wallets[1].getLabel(), 'testlabel2');
  await Storage2.saveToDisk();
  // saved to encrypted storage after load. next load should be successfull
  Storage2 = new AppStorage();
  isEncrypted = await Storage2.storageIsEncrypted();
  assert.ok(isEncrypted);
  loadResult = await Storage2.loadFromDisk('password');
  assert.ok(loadResult);
  assert.equal(Storage2.wallets.length, 2);
  assert.equal(Storage2.wallets[0].getLabel(), 'testlabel');
  assert.equal(Storage2.wallets[1].getLabel(), 'testlabel2');

  // next, adding new `fake` storage which should be unlocked with `fake` password
  let createFakeStorageResult = await Storage2.createFakeStorage('fakePassword');
  assert.ok(createFakeStorageResult);
  assert.equal(Storage2.wallets.length, 0);
  assert.equal(Storage2.cachedPassword, 'fakePassword');
  w = new SegwitP2SHWallet();
  w.setLabel('fakewallet');
  w.generate();
  Storage2.wallets.push(w);
  await Storage2.saveToDisk();
  // now, will try to load & decrypt with real password and with fake password
  // real:
  let Storage3 = new AppStorage();
  loadResult = await Storage3.loadFromDisk('password');
  assert.ok(loadResult);
  assert.equal(Storage3.wallets.length, 2);
  assert.equal(Storage3.wallets[0].getLabel(), 'testlabel');
  // fake:
  Storage3 = new AppStorage();
  loadResult = await Storage3.loadFromDisk('fakePassword');
  assert.ok(loadResult);
  assert.equal(Storage3.wallets.length, 1);
  assert.equal(Storage3.wallets[0].getLabel(), 'fakewallet');
});

it('Wallet can fetch UTXO', async () => {
  jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;
  let w = new SegwitP2SHWallet();
  w._address = '12c6DSiU4Rq3P4ZxziKxzrL5LmMBrzjrJX';
  await w.fetchUtxo();
  assert.ok(w.utxo.length > 0, 'unexpected empty UTXO');
});

it('Wallet can fetch balance', async () => {
  jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;
  let w = new LegacyWallet();
  w._address = '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa'; // hack internals
  assert.ok(w.getBalance() === 0);
  assert.ok(w.getUnconfirmedBalance() === 0);
  assert.ok(w._lastBalanceFetch === 0);
  await w.fetchBalance();
  assert.ok(w.getBalance() > 0);
  assert.ok(w.getUnconfirmedBalance() === 0);
  assert.ok(w._lastBalanceFetch > 0);
});

it('Wallet can fetch TXs', async () => {
  let w = new LegacyWallet();
  w._address = '12eQ9m4sgAwTSQoNXkRABKhCXCsjm2jdVG';
  await w.fetchTransactions();
  assert.equal(w.getTransactions().length, 2);

  let tx0 = w.getTransactions()[0];
  let txExpected = {
    block_hash: '0000000000000000000d05c54a592db8532f134e12b4c3ae0821ce582fad3566',
    block_height: 530933,
    block_index: 1587,
    hash: '4924f3a29acdee007ebcf6084d2c9e1752c4eb7f26f7d1a06ef808780bf5fe6d',
    addresses: ['12eQ9m4sgAwTSQoNXkRABKhCXCsjm2jdVG', '3BDsBDxDimYgNZzsqszNZobqQq3yeUoJf2'],
    total: 800,
    fees: 200,
    size: 190,
    preference: 'low',
    relayed_by: '18.197.135.148:8333',
    confirmed: '2018-07-07T20:05:30Z',
    received: '2018-07-07T20:02:01.637Z',
    ver: 1,
    double_spend: false,
    vin_sz: 1,
    vout_sz: 1,
    confirmations: 593,
    confidence: 1,
    inputs: [
      {
        prev_hash: 'd0432027a86119c63a0be8fa453275c2333b59067f1e559389cd3e0e377c8b96',
        output_index: 1,
        script:
          '483045022100e443784abe25b6d39e01c95900834bf4eeaa82505ac0eb84c08e11c287d467de02203327c2b1136f4976f755ed7631b427d66db2278414e7faf1268eedf44c034e0c012103c69b905f7242b3688122f06951339a1ee00da652f6ecc6527ea6632146cace62',
        output_value: 1000,
        sequence: 4294967295,
        addresses: ['12eQ9m4sgAwTSQoNXkRABKhCXCsjm2jdVG'],
        script_type: 'pay-to-pubkey-hash',
        age: 530926,
      },
    ],
    outputs: [
      {
        value: 800,
        script: 'a914688eb9af71aab8ca221f4e6171a45fc46ea8743b87',
        spent_by: '009c6219deeac341833642193e4a3b72e511105a61b48e375c5025b1bcbd6fb5',
        addresses: ['3BDsBDxDimYgNZzsqszNZobqQq3yeUoJf2'],
        script_type: 'pay-to-script-hash',
      },
    ],
    value: -1000,
  };

  delete tx0.confirmations;
  delete txExpected.confirmations;
  assert.deepEqual(tx0, txExpected);
});

describe('currency', () => {
  it('fetches exchange rate and saves to AsyncStorage', async () => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 15000;
    AsyncStorage.storageCache = {}; // cleanup from other tests
    let currency = require('./currency');
    await currency.startUpdater();
    let cur = AsyncStorage.storageCache[AppStorage.CURRENCY];
    cur = JSON.parse(cur);
    assert.ok(Number.isInteger(cur[currency.STRUCT.LAST_UPDATED]));
    assert.ok(cur[currency.STRUCT.LAST_UPDATED] > 0);
    assert.ok(cur[currency.STRUCT.BTC_USD] > 0);
  });
});

describe('Watch only wallet', () => {
  it('can fetch balance', async () => {
    let w = new WatchOnlyWallet();
    w.setSecret('1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa');
    await w.fetchBalance();
    assert.ok(w.getBalance() > 16);
  });

  it('can fetch tx', async () => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 30 * 1000;
    let w = new WatchOnlyWallet();

    w.setSecret('167zK5iZrs1U6piDqubD3FjRqUTM2CZnb8');
    await w.fetchTransactions();
    assert.equal(w.getTransactions().length, 233);

    w = new WatchOnlyWallet();
    w.setSecret('1BiJW1jyUaxcJp2JWwbPLPzB1toPNWTFJV');
    await w.fetchTransactions();
    assert.equal(w.getTransactions().length, 2);

    // fetch again and make sure no duplicates
    await w.fetchTransactions();
    assert.equal(w.getTransactions().length, 2);
  });

  it('can validate address', async () => {
    let w = new WatchOnlyWallet();
    w.setSecret('12eQ9m4sgAwTSQoNXkRABKhCXCsjm2jdVG');
    assert.ok(w.valid());
    w.setSecret('3BDsBDxDimYgNZzsqszNZobqQq3yeUoJf2');
    assert.ok(w.valid());
    w.setSecret('not valid');
    assert.ok(!w.valid());
  });
});
