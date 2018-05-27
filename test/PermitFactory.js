const web3 = require('web3')
const PermitFactory = artifacts.require('./PermitFactory.sol')

contract('PermitFactory', accounts => {
  let permitFactoryInstance
  let whitelistInstance

  const ACC_OWNER = accounts[0]
  const EXPORT_COUNTRY = 'DE'
  const ACC_EXPORT = accounts[1]
  const IMPORT_COUNTRY = 'FR'
  const ACC_IMPORT = accounts[2]
  const PERMIT_TYPE = 0
  const IMPORTER = ['Importer Name', 'Importer Street', 'Importer City']
  const EXPORTER = ['Exporter Name', 'Exporter Street', 'Exporter City']
  const QUANTITIES = [100, 200]
  const SCIENTIFIC_NAMES = ['Scientific Name 1', 'Scientific Name 2']
  const COMMON_NAMES = ['Common Name 1', 'Common Name 2']
  const DESCRIPTIONS = ['Description 1', 'Description 2']
  const ORIGIN_HASHES = ['', '']
  const RE_EXPORT_HASHES = ['', '']

  const { hexToUtf8, asciiToHex, BN } = web3.utils

  before(async () => {
    // add addresses to whitelist so modifiers can be pleased
    permitFactoryInstance = await PermitFactory.deployed()
    await permitFactoryInstance.addAddress(ACC_EXPORT, EXPORT_COUNTRY, {
      from: ACC_OWNER
    })
    await permitFactoryInstance.addAddress(ACC_IMPORT, IMPORT_COUNTRY, {
      from: ACC_OWNER
    })
  })

  describe('#createPermit', () => {
    it('should create permit', async () => {
      const result = await permitFactoryInstance.createPermit(
        EXPORT_COUNTRY,
        IMPORT_COUNTRY,
        PERMIT_TYPE,
        EXPORTER,
        IMPORTER,
        QUANTITIES,
        SCIENTIFIC_NAMES,
        COMMON_NAMES,
        DESCRIPTIONS,
        ORIGIN_HASHES,
        RE_EXPORT_HASHES,
        { from: ACC_EXPORT }
      )
      const [ log ] = result.logs.filter(log => log.event === 'PermitCreated')
      const { permitHash } = log.args
      const permit = await permitFactoryInstance.getPermit.call(permitHash)
      assert.equal(hexToUtf8(permit[0]), 'DE')
      assert.equal(hexToUtf8(permit[1]), 'FR')
      assert.equal(hexToUtf8(permit[3][0]), 'Exporter Name')
      assert.equal(hexToUtf8(permit[3][1]), 'Exporter Street')
      assert.equal(hexToUtf8(permit[3][2]), 'Exporter City')
      assert.equal(hexToUtf8(permit[4][0]), 'Importer Name')
      assert.equal(hexToUtf8(permit[4][1]), 'Importer Street')
      assert.equal(hexToUtf8(permit[4][2]), 'Importer City')
    })
  })

  describe('#createPaperPermit', () => {
    it('should create paper permit', async () => {
      const result = await permitFactoryInstance.createPaperPermit(
        EXPORT_COUNTRY,
        IMPORT_COUNTRY,
        PERMIT_TYPE,
        EXPORTER,
        IMPORTER,
        QUANTITIES,
        SCIENTIFIC_NAMES,
        COMMON_NAMES,
        DESCRIPTIONS,
        ORIGIN_HASHES,
        RE_EXPORT_HASHES,
        { from: ACC_IMPORT }
      )
      const [ log ] = result.logs.filter(log => log.event === 'PermitCreated')
      const { permitHash } = log.args
      const permit = await permitFactoryInstance.getPermit.call(permitHash)
      assert.equal(hexToUtf8(permit[0]), 'DE')
      assert.equal(hexToUtf8(permit[1]), 'FR')
      assert.equal(hexToUtf8(permit[3][0]), 'Exporter Name')
      assert.equal(hexToUtf8(permit[3][1]), 'Exporter Street')
      assert.equal(hexToUtf8(permit[3][2]), 'Exporter City')
      assert.equal(hexToUtf8(permit[4][0]), 'Importer Name')
      assert.equal(hexToUtf8(permit[4][1]), 'Importer Street')
      assert.equal(hexToUtf8(permit[4][2]), 'Importer City')
    })
  })

  describe('#confirmPermit', () => {
    let permitHash
    let specimenHashes

    before(async () => {
      const result = await permitFactoryInstance.createPermit(
        EXPORT_COUNTRY,
        IMPORT_COUNTRY,
        PERMIT_TYPE,
        EXPORTER,
        IMPORTER,
        QUANTITIES,
        SCIENTIFIC_NAMES,
        COMMON_NAMES,
        DESCRIPTIONS,
        ORIGIN_HASHES,
        RE_EXPORT_HASHES,
        { from: ACC_EXPORT }
      )
      const [ log ] = result.logs.filter(log => log.event === 'PermitCreated')
      permitHash = log.args.permitHash
      const permit = await permitFactoryInstance.getPermit.call(permitHash)
      specimenHashes = permit[5]      
    })

    it('should confirm permit', async () => {
      const result = await permitFactoryInstance.confirmPermit(permitHash, specimenHashes, true, {
        from: ACC_IMPORT
      })
      const [ log ] = result.logs.filter(log => log.event === 'PermitConfirmed')
      const { exportCountry, importCountry, isAccepted } = log.args
      assert.equal(hexToUtf8(exportCountry), 'DE')
      assert.equal(hexToUtf8(importCountry), 'FR')
      assert.equal(isAccepted, true)
    })
  })

  // TODO more testing
})