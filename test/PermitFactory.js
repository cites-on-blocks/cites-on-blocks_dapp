const web3 = require('web3')
const PermitFactory = artifacts.require('./PermitFactory.sol')

const { hexToUtf8, asciiToHex, BN } = web3.utils

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

  // TODO split up into separate tests
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
      assert.equal(hexToUtf8(permit[0]), EXPORT_COUNTRY)
      assert.equal(hexToUtf8(permit[1]), IMPORT_COUNTRY)
      assert.equal(permit[2], PERMIT_TYPE)
      assert.equal(hexToUtf8(permit[3][0]), EXPORTER[0])
      assert.equal(hexToUtf8(permit[3][1]), EXPORTER[1])
      assert.equal(hexToUtf8(permit[3][2]), EXPORTER[2])
      assert.equal(hexToUtf8(permit[4][0]), IMPORTER[0])
      assert.equal(hexToUtf8(permit[4][1]), IMPORTER[1])
      assert.equal(hexToUtf8(permit[4][2]), IMPORTER[2])
      assert.lengthOf(permit[5], QUANTITIES.length)
      assert.isAbove(permit[6], 0)

      // test specimen 1
      const specimenHashes = permit[5]
      const specimen_1 = await permitFactoryInstance.specimens(specimenHashes[0])
      assert.equal(specimen_1[0], permitHash)
      assert.equal(specimen_1[1].toString(), QUANTITIES[0].toString())
      assert.equal(hexToUtf8(specimen_1[2]), SCIENTIFIC_NAMES[0])
      assert.equal(hexToUtf8(specimen_1[3]), COMMON_NAMES[0])
      assert.equal(hexToUtf8(specimen_1[4]), DESCRIPTIONS[0])
    })
    // TODO more tests    
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
      assert.equal(hexToUtf8(permit[0]), EXPORT_COUNTRY)
      assert.equal(hexToUtf8(permit[1]), IMPORT_COUNTRY)
      assert.equal(permit[2], PERMIT_TYPE)
      assert.equal(hexToUtf8(permit[3][0]), EXPORTER[0])
      assert.equal(hexToUtf8(permit[3][1]), EXPORTER[1])
      assert.equal(hexToUtf8(permit[3][2]), EXPORTER[2])
      assert.equal(hexToUtf8(permit[4][0]), IMPORTER[0])
      assert.equal(hexToUtf8(permit[4][1]), IMPORTER[1])
      assert.equal(hexToUtf8(permit[4][2]), IMPORTER[2])
      assert.lengthOf(permit[5], QUANTITIES.length)
      assert.isAbove(permit[6], 0)
    })
    // TODO more tests    
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
      assert.equal(hexToUtf8(exportCountry), EXPORT_COUNTRY)
      assert.equal(hexToUtf8(importCountry), IMPORT_COUNTRY)
      assert.equal(isAccepted, true)
    })
    // TODO more tests
  })

  // TODO #getPermitHash()
  // TODO #getSpecimenHash()
})