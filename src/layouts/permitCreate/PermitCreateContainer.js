import PermitCreate from './PermitCreate'
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

const PermitCreateContainer = drizzleConnect(PermitCreate, mapStateToProps)

export default PermitCreateContainer
