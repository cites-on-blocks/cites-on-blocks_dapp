const PermitFactory = artifacts.require('PermitFactory')

module.exports = async (deployer, network, accounts) => {
  await deployer.deploy(PermitFactory)

  // set whitelist for dev purposes
  if (network === 'development') {
    const permitFactory = await PermitFactory.deployed()
    await permitFactory.addAddress(accounts[1], 'DE')
    await permitFactory.addAddress(accounts[2], 'FR')
  }
}
