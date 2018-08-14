const Web3 = require('web3')
const fetch = require('node-fetch')
const chalk = require('chalk')
const PermitFactory = artifacts.require('./PermitFactory.sol')

const rpcProvider = 'http://localhost:8545'
const web3 = new Web3(rpcProvider)

const ACCOUNTS = require('./addresses')

/**
 * This is NOT a unit, integration or system test. Its purpose is solely to test various configurations of
 * the Parity PoA setup. We create 1000 accounts, whitelist them and send 10, 100 and 1000 transactions at
 * once to test the time it takes.
 */
contract('PermitFactory', () => {
  let permitFactoryInstance

  const ACC_OWNER = '0x6b0c56d1ad5144b4d37fa6e27dc9afd5c2435c3b'
  let ACCS_UNLOCKED = []

  const EXPORT_COUNTRY = 'DE'
  const IMPORT_COUNTRY = 'FR'
  const PERMIT_TYPE = 0
  
  // NOTE: Use 32 characters to test max. possible gas for tx
  const IMPORTER = [
    'Looooooooooooooong Importer Name',
    'Looooooooooooong Importer Street',
    'Looooooooooooooong Importer City'
  ]
  const EXPORTER = [
    'Looooooooooooooong Exporter Name',
    'Looooooooooooong Exporter Street',
    'Looooooooooooooong Exporter City'
  ]
  const SPECIMEN = {
    scientificName: 'Looooooooooooong Scientific Name',
    commonName: 'Looooooooooooooooong Common Name',
    description: 'Looooooooooooooooong Description',
    originHash: '0x7026c6e8138e186532cfeed43a88565dc31105a4bac8db5ff76db82cb41e7f07',
    reExportHash: '0x7026c6e8138e186532cfeed43a88565dc31105a4bac8db5ff76db82cb41e7f07',
    quantity: 1000000000
  }
  const SPECIMENS_COUNT = 3

  const getCreatePermitPromises = (promiseCount) => {
    return Promise.all(ACCS_UNLOCKED
      .slice(0, promiseCount)
      .map(address => permitFactoryInstance.createPermit(
        EXPORT_COUNTRY,
        IMPORT_COUNTRY,
        PERMIT_TYPE,
        EXPORTER,
        IMPORTER,
        Array(SPECIMENS_COUNT).fill(SPECIMEN.quantity),
        Array(SPECIMENS_COUNT).fill(SPECIMEN.scientificName),
        Array(SPECIMENS_COUNT).fill(SPECIMEN.commonName),
        Array(SPECIMENS_COUNT).fill(SPECIMEN.description),
        Array(SPECIMENS_COUNT).fill(SPECIMEN.originHash),
        Array(SPECIMENS_COUNT).fill(SPECIMEN.reExportHash),
        {
          from: address,
          gasPrice: 0,
          gas: '0xB71B0'
        }
      )
    ))
  }

  const getUncleCount = async (rpcProviderUrl, fromBlock, toBlock) => {
    const getUnclePromises = []
    for (let i = fromBlock; i <= toBlock; i++) {
      getUnclePromises.push(fetch(rpcProviderUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          method: 'eth_getUncleCountByBlockNumber',
          params:[web3.utils.toHex(i)],
          id: 8995,
          jsonrpc: '2.0'
        })
      }))
    }
    const results = await Promise.all(getUnclePromises)
    const jsonResults = await Promise.all(results.map(res => res.json()))
    return jsonResults.reduce(
      (totalUncleCount, current) => totalUncleCount + web3.utils.hexToNumber(current.result), 0
    )
  }

  describe('#createPermit - performance', () => {
    let from
    let fromBlock
    let to
    let toBlock
    let totalUncleCount

    before(async () => {
      permitFactoryInstance = await PermitFactory.deployed()
      // Create, whitelist and unlock accounts if not already done
      if (ACCOUNTS.length === 0) {
        console.log('PermitFactory at ' + permitFactoryInstance.address)
        console.log('===========================================')
        console.log('Create, unlock and whitelist accounts...')
        for (let i = 0; i < 1000; i++) {
          // create new account with empty password
          const newAccount = await web3.eth.personal.newAccount('')
          await Promise.all([
            // unlock account for 6000 seconds (100 minutes)
            await web3.eth.personal.unlockAccount(newAccount, '', '0x1770'),
            // add new created account to whitelist
            await permitFactoryInstance.addAddress(newAccount, EXPORT_COUNTRY, {
              from: ACC_OWNER
            }),
            // send some eth to new created account
            await web3.eth.sendTransaction({
              from: ACC_OWNER,
              to: newAccount,
              value: web3.utils.toWei('1', 'ether')
            })
          ])
          ACCS_UNLOCKED.push(newAccount)
          console.log(`${i + 1}) ${newAccount}`)
        }
        console.log('done.')
        console.log('===========================================')
      } else {  // use already whitelisted accounts if existent
        permitFactoryInstance = await PermitFactory.at('0x0a35db94da8e787b1c10bc5d9a7761d151bedeaf')
        console.log('')
        console.log('===========================================')
        console.log('Unlocking accounts...')
        await Promise.all(ACCOUNTS.map(account => {
          ACCS_UNLOCKED.push(account)
          return web3.eth.personal.unlockAccount(account, '', '0x1770')
        }))
        console.log('done.')
        console.log('===========================================')
        console.log('')
      }
    })

    beforeEach(async () => {
      from = new Date()
      fromBlock = await web3.eth.getBlock('latest')
    })

    afterEach(async () => {
      to = new Date()
      toBlock = await web3.eth.getBlock('latest')
      totalUncleCount = await getUncleCount(rpcProvider, fromBlock.number, toBlock.number)
      console.log('')
      console.log(`Block:       ${fromBlock.number} - ${toBlock.number}`)
      console.log(`Duration:    ${chalk.green(Math.abs(from.getTime() - to.getTime()) + 'ms')}`)
      console.log(`Uncle count: ${chalk.green(totalUncleCount)}`)
      console.log('')
    })

    it('send 10 transactions at once', async () => {
      const results = await getCreatePermitPromises(10)
      assert.equal(results.length, 10)
    })

    it('send 100 transactions at once', async () => {
      const results = await getCreatePermitPromises(100)
      assert.equal(results.length, 100)
    })

    it('send 1000 transactions at once', async () => {
      const results = await getCreatePermitPromises(1000)
      assert.equal(results.length, 1000)
    })
  })
})
