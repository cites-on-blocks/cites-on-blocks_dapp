const Web3 = require('web3')
const web3 = new Web3(Web3.givenProvider || 'ws://localhost:8546')
const PermitFatory = artifacts.require('./PermitFactory.sol')

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

  before(done => {
    PermitFatory.deployed()
      .then(instance => {
        permitFactoryInstance = instance
        done()
      })
  })

  describe('#createPermit', () => {
    it('should create permit', done => {
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
          done()
        })
      }).catch(e => console.log('ERROR', e))
    })
  })

  describe('#confirmPermit', () => {
    let permitHash
    let specimenHashes

    before(done => {
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
        permitHash = log.args.permitHash
        permitFactoryInstance.getPermit.call(permitHash, { from: accounts[0] }).then(permit => {
          specimenHashes = permit[5]
          done()
        })
      })
    })

    it('should confirm permit', done => {
      permitFactoryInstance.confirmPermit(permitHash, specimenHashes, true)
        .then(result => {
          const [ log ] = result.logs.filter(log => log.event === 'PermitConfirmed')
          const { exportCountry, importCountry, isAccepted } = log.args
          assert.equal(hexToUtf8(exportCountry), 'DE')
          assert.equal(hexToUtf8(importCountry), 'FR')
          assert.equal(isAccepted, true)
          done()
      })
    })
  })
})