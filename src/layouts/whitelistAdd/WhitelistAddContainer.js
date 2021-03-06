import WhitelistAdd from './WhitelistAdd'
import { drizzleConnect } from 'drizzle-react'

// May still need this even with data function to refresh component on updates for this contract.
const mapStateToProps = state => {
  return {
    accounts: state.accounts,
    drizzleStatus: state.drizzleStatus,
    transactions: state.transactions,
    transactionStack: state.transactionStack,
    PermitFactory: state.contracts.PermitFactory
  }
}

const WhitelistAddContainer = drizzleConnect(WhitelistAdd, mapStateToProps)

export default WhitelistAddContainer
