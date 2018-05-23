const Whitelist = artifacts.require('Whitelist')
const PermitFactory = artifacts.require('PermitFactory')

module.exports = deployer => {
  deployer.deploy(Whitelist)
  deployer.deploy(PermitFactory)
}
