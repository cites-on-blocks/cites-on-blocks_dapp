const web3 = require('web3')
const PermitFactory = artifacts.require('./PermitFactory.sol')

contract('PermitFactory', accounts => {
  let permitFactoryInstance
  const exportCountry = 'DE'
  const importCountry = 'FR'
  const permitType = 1
  const importer = ['Importer Name', 'Importer Street', 'Importer City']
  const exporter = ['Exporter Name', 'Exporter Street', 'Exporter City']
  const quantities = [100, 200]
  const scientificNames = ['Scientific Name 1', 'Scientific Name 2']
  const commonNames = ['Common Name 1', 'Common Name 2']
  const descriptions = ['Description 1', 'Description 2']
  const originHashes = ['', '']
  const reExportHashes = ['', '']
  const { hexToUtf8, asciiToHex, BN } = web3.utils

  before(async () => {
    permitFactoryInstance = await PermitFactory.deployed()
  })

  // NOTE skipping tests for now
  // TODO cover whitelist modifier in tests
  describe.skip('#createPermit', () => {
    it('should create permit', async () => {
      const result = await permitFactoryInstance.createPermit(
        exportCountry,
        importCountry,
        permitType,
        exporter,
        importer,
        quantities,
        scientificNames,
        commonNames,
        descriptions,
        originHashes,
        reExportHashes,
        { from: accounts[0] }
      )
      const [ log ] = result.logs.filter(log => log.event === 'PermitCreated')
      const { permitHash } = log.args
      const permit = await permitFactoryInstance.getPermit.call(permitHash, { from: accounts[0] })
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

  // NOTE skipping tests for now
  // TODO cover whitelist modifier in tests
  describe.skip('#confirmPermit', () => {
    let permitHash
    let specimenHashes

    before(async () => {
      const result = await permitFactoryInstance.createPermit(
        exportCountry,
        importCountry,
        permitType,
        exporter,
        importer,
        quantities,
        scientificNames,
        commonNames,
        descriptions,
        originHashes,
        reExportHashes,
        { from: accounts[0] }
      )
      const [ log ] = result.logs.filter(log => log.event === 'PermitCreated')
      permitHash = log.args.permitHash
      const permit = await permitFactoryInstance.getPermit.call(permitHash, { from: accounts[0] })
      specimenHashes = permit[5]      
    })

    it('should confirm permit', async () => {
      const result = await permitFactoryInstance.confirmPermit(permitHash, specimenHashes, true)
      const [ log ] = result.logs.filter(log => log.event === 'PermitConfirmed')
      const { exportCountry, importCountry, isAccepted } = log.args
      assert.equal(hexToUtf8(exportCountry), 'DE')
      assert.equal(hexToUtf8(importCountry), 'FR')
      assert.equal(isAccepted, true)
    })
  })
})