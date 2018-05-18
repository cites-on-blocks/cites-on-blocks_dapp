const Web3 = require('web3')
const web3 = new Web3(Web3.givenProvider || 'ws://localhost:8546')
const PermitFatory = artifacts.require('./PermitFactory.sol')

contract('PermitFactory', accounts => {
  let permitFactoryInstance
  const { hexToUtf8, asciiToHex, BN } = web3.utils

  before(done => {
    PermitFatory.deployed()
      .then(instance => {
        permitFactoryInstance = instance
        done()
      })
  })

  describe('#createPermit', () => {
    it('should create permit', done => {
      const exportCountry = 'DE'
      const importCountry = 'FR'
      const permitType = 1
      const importer = ['Importer Name', 'Importer Street', 'Importer City']
      const exporter = ['Exporter Name', 'Exporter Street', 'Exporter City']
      const quantities = [100]
      const scientificNames = ['Scientific Name']
      const commonNames = ['Common Name']
      const descriptions = ['Description']
      const originHashes = ['']
      const reExportHashes = ['']
      permitFactoryInstance.createPermit(
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
      ).then(result => {
        const [ log ] = result.logs.filter(log => log.event === 'PermitCreated')
        const { permitHash } = log.args
        permitFactoryInstance.getPermit.call(permitHash, { from: accounts[0] }).then(permit => {
          const [
            exportCountry,
            importCountry,
            permitType,
            exporter,
            importer,
            specimenHashes,
            nonce
          ] = permit
          assert.equal(hexToUtf8(exportCountry), 'DE')
          assert.equal(hexToUtf8(importCountry), 'FR')
          assert.equal(hexToUtf8(exporter[0]), 'Exporter Name')
          assert.equal(hexToUtf8(exporter[1]), 'Exporter Street')
          assert.equal(hexToUtf8(exporter[2]), 'Exporter City')
          assert.equal(hexToUtf8(importer[0]), 'Importer Name')
          assert.equal(hexToUtf8(importer[1]), 'Importer Street')
          assert.equal(hexToUtf8(importer[2]), 'Importer City')
          console.log(hexToUtf8(importer[0]))
          done()
        })
      }).catch(e => console.log('ERROR', e))
    })
  })
})