import Help from './Help'
import { drizzleConnect } from 'drizzle-react'

// May still need this even with data function to refresh component on updates for this contract.
const mapStateToProps = state => {
  return {
    accounts: state.accounts,
    drizzleStatus: state.drizzleStatus
  }
}

const HelpContainer = drizzleConnect(Help, mapStateToProps);

export default HelpContainer
