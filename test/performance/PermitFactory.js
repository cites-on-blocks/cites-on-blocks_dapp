const Web3 = require('web3')
const PermitFactory = artifacts.require('./PermitFactory.sol')

const web3 = new Web3('http://localhost:8545')

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

  describe('#createPermit - performance', () => {
    before(async () => {
      permitFactoryInstance = await PermitFactory.deployed()
      console.log('===========================================')
      console.log('Create, unlock and whitelist accounts...')
      for (let i = 0; i < 1000; i++) {
        // create new account with empty password
        const newAccount = await web3.eth.personal.newAccount('')
        // unlock account for 3600 seconds (60 minutes)
        await web3.eth.personal.unlockAccount(newAccount, '', '0xE10')
        // add new created account to whitelist
        await permitFactoryInstance.addAddress(newAccount, EXPORT_COUNTRY, {
          from: ACC_OWNER
        })
        // send some eth to new created account
        await web3.eth.sendTransaction({
          from: ACC_OWNER,
          to: newAccount,
          value: web3.utils.toWei('1', 'ether')
        })
        ACCS_UNLOCKED.push(newAccount)
        console.log(`${i + 1}) ${newAccount}`)
      }
      console.log('done.')
      console.log('===========================================')
    })

    it('send 10 transactions at once', async () => {
      const results = await Promise.all(ACCS_UNLOCKED
        .slice(0, 10)
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
            gasPrice: 0
          }
        )
      ))
      assert.equal(results.length, 10)
    })

    it('send 100 transactions at once', async () => {
      const results = await Promise.all(ACCS_UNLOCKED
        .slice(0, 100)
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
            gasPrice: 0
          }
        )
      ))
      assert.equal(results.length, 100)
    })

    it('send 1000 transactions at once', async () => {
      const results = await Promise.all(ACCS_UNLOCKED
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
            gasPrice: 0
          }
        )
      ))
      assert.equal(results.length, 1000)
    })
  })
})
