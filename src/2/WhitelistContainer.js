import Whitelist from './Whitelist'
import { drizzleConnect } from 'drizzle-react'

// May still need this even with data function to refresh component on updates for this contract.
const mapStateToProps = state => {
  return {
    accounts: state.accounts,
    SimpleStorage: state.contracts.SimpleStorage,
    TutorialToken: state.contracts.TutorialToken,
    drizzleStatus: state.drizzleStatus
  }
}

const WhitelistContainer = drizzleConnect(Whitelist, mapStateToProps);

export default WhitelistContainer
