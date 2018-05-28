import Permits from './Permits'
import { drizzleConnect } from 'drizzle-react'

const mapStateToProps = state => {
  return {
    accounts: state.accounts,
    PermitFactory: state.contracts.PermitFactory,
    transactions: state.transactions,
    transactionStack: state.transactionStack,
    drizzleStatus: state.drizzleStatus
  }
}

const PermitsContainer = drizzleConnect(Permits, mapStateToProps)

export default PermitsContainer
