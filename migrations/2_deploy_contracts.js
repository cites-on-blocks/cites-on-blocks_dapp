const PermitFactory = artifacts.require('PermitFactory')

module.exports = async (deployer, network, accounts) => {
  await deployer.deploy(PermitFactory)

  if (network === 'development') {
    const permitFactory = await PermitFactory.deployed()
    await permitFactory.addAddress(accounts[1], 'DE')
    await permitFactory.addAddress(accounts[2], 'SE')
    await permitFactory.addAddress(accounts[3], 'DK')
    await permitFactory.addAddress(accounts[4], 'DK')
    await permitFactory.addAddress(accounts[5], 'DK')
    await permitFactory.addAddress(accounts[6], 'FR')
    await permitFactory.addAddress(accounts[7], 'FR')
    await permitFactory.addAddress(accounts[8], 'FR')
  }
}
