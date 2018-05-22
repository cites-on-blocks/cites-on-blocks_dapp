const Whitelist = artifacts.require('Whitelist')

module.exports = deployer => {
  deployer.deploy(Whitelist)
}
