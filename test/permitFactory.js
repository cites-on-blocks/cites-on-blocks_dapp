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
      const importer = '0x7af0244f9ea4612a6ffb371b0e7ad8973fb78ce4'
      const permitType = 1
      const imNameAndAddress = [asciiToHex('Importer Name'), asciiToHex('Importer Street'), asciiToHex('Importer City')]
      const exNameAndAddress = [asciiToHex('Exporter Name'), asciiToHex('Exporter Street'), asciiToHex('Exporter City')]
      const quantities = [100]
      const scientificNames = [asciiToHex('Scientific Name')]
      const commonNames = [asciiToHex('Common Name')]
      const descriptions = [asciiToHex('Description')]
      const originHashes = [asciiToHex('')]
      const reExportHashes = [asciiToHex('')]
      permitFactoryInstance.createPermit(
        importer,
        permitType,
        exNameAndAddress,
        imNameAndAddress,
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
            exporter,
            importer,
            permitType,
            exNameAndAddress,
            imNameAndAddress,
            specimenHashes,
            nonce
          ] = permit
          assert.equal(exporter, accounts[0], 'Exporter is not msg.sender!')
          assert.equal(importer, '0x7af0244f9ea4612a6ffb371b0e7ad8973fb78ce4', 'Wrong importer address!')
          assert.equal(hexToUtf8(exNameAndAddress[0]), 'Exporter Name')
          assert.equal(hexToUtf8(exNameAndAddress[1]), 'Exporter Street')
          assert.equal(hexToUtf8(exNameAndAddress[2]), 'Exporter City')
          assert.equal(hexToUtf8(imNameAndAddress[0]), 'Importer Name')
          assert.equal(hexToUtf8(imNameAndAddress[1]), 'Importer Street')
          assert.equal(hexToUtf8(imNameAndAddress[2]), 'Importer City')
          done()
        })
      }).catch(e => console.log('ERROR', e))
    })
  })
})