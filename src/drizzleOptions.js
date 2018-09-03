import PermitFactory from './../build/contracts/PermitFactory.json'

const drizzleOptions = {
  web3: {
    fallback: {
      type: 'ws',
      url: 'ws://127.0.0.1:8545'
    }
  },
  contracts: [PermitFactory],
  events: {
    PermitFactory: ['AddressWhitelisted', 'PermitCreated', 'PermitConfirmed']
  },
  polls: {
    accounts: 1500
  }
}

export default drizzleOptions
