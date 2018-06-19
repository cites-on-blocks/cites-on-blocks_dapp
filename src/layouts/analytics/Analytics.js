import React, { Component } from 'react'
import PropTypes from 'prop-types'
import DesktopIcon from 'grommet/components/icons/base/Desktop'
import {
  Box,
  Sidebar,
  Header,
  Footer,
  Title,
  Anchor,
  Menu,
  Legend,
  SunBurst
} from 'grommet'
import AnnotatedMeter from 'grommet-addons/components/AnnotatedMeter'
import AnalyticsMeter from '../../components/AnalyticsMeter'
import local from '../../localization/localizedStrings'
import Web3 from 'web3'

import {
  parseRawPermit,
  parseRawSpecimen,
  mergePermitEvents,
  getPermitEvents,
  blockNumberToUnix
} from '../../util/permitUtils'

class Analytics extends Component {
  constructor(props, context) {
    super(props)
    this.state = {
      // permit events
      events: [],
      //permits
      permits: []
      //permit Chart Variables
    }
    this.contracts = context.drizzle.contracts
    // NOTE: We have to iniate a new web3 instance for retrieving event via `getPastEvents`.
    //       MetaMask does not support websockets and Drizzle retrieves events via subscriptions.
    const web3 = new Web3(this.contracts.PermitFactory.givenProvider)
    const { abi, address } = this.contracts.PermitFactory
    this.PermitFactory = new web3.eth.Contract(abi, address)
    this.web3 = web3
  }

  async componentDidMount() {
    await this.getEvents()
    await this.getPermits()
  }

  async getEvents(from = 0) {
    const [createdPermits, confirmedPermits] = await Promise.all([
      getPermitEvents(this.PermitFactory, 'PermitCreated', from),
      getPermitEvents(this.PermitFactory, 'PermitConfirmed', from)
    ])
    const events = createdPermits.concat(confirmedPermits)
    const newEvents = await blockNumberToUnix(this.web3, events)
    const mergedEvents = mergePermitEvents(this.state.events, newEvents).sort(
      (a, b) => b.blockNumber - a.blockNumber
    )
    this.setState({
      ...this.state,
      events: mergedEvents
    })
  }

  createPermitSeries() {
    let arr = this.state.permits
    let colors = { 'RE-EXPORT': 'warning', EXPORT: 'ok', OTHER: 'critical' }
    let result = Object.values(
      arr.reduce((c, { permitType }) => {
        c[permitType] = c[permitType] || {
          label: permitType,
          value: 0,
          colorIndex: colors[permitType]
        }
        c[permitType].value++
        return c
      }, {})
    )
    return result
  }

  async getPermits() {
    let permits = []
    for (const event of this.state.events) {
      const rawPermit = await this.contracts.PermitFactory.methods
        .getPermit(event.permitHash)
        .call()
      const parsedPermit = parseRawPermit(rawPermit)
      const specimenPromises = parsedPermit.specimenHashes.map(s =>
        this.contracts.PermitFactory.methods.specimens(s).call()
      )
      const rawSpecimens = await Promise.all(specimenPromises)
      const parsedSpecimens = rawSpecimens.map(s => parseRawSpecimen(s))
      permits.push({
        ...parsedPermit,
        specimens: parsedSpecimens,
        status: event.status,
        timestamp: event.timestamp,
        permitHash: event.permitHash
      })
    }
    this.setState({
      permits
    })
  }

  render() {
    return (
      <Box
        direction="row"
        justify="start"
        align="start"
        wrap={true}
        pad="none"
        margin="none"
        colorIndex="light-1">
        <Sidebar colorIndex="light-2" fixed={true}>
          <Header pad="medium" justify="between">
            <Title>{local.analytics.headline}</Title>
          </Header>
          <Box flex="grow" justify="start">
            <Menu primary={true}>
              <Anchor className="active">
                <DesktopIcon />
                {local.analytics.menu}
              </Anchor>
            </Menu>
          </Box>
          <Footer />
        </Sidebar>
        <Box
          pad="none"
          justify="center"
          align="center"
          wrap={true}
          margin="small">
          <Box direction="row" pad="small" justify="center" align="center">
            <AnalyticsMeter
              analyticsTitle={local.analytics.permitChart.headline}
              permitTotal={this.createPermitSeries().length}
              series={this.createPermitSeries()}
            />
            <AnalyticsMeter
              analyticsTitle={local.analytics.workChart.headline}
              permitTotal={this.state.permits.length}
              series={this.createPermitSeries()}
            />
            <Box colorIndex="light-1" wrap={true} pad="small" margin="none">
              <Title>Species</Title>
              <AnnotatedMeter
                type="circle"
                max={70}
                size="small"
                series={[
                  { label: 'Croco', value: 20, colorIndex: 'brand' },
                  { label: 'Snake', value: 50, colorIndex: 'critical' }
                ]}
                legend={false}
              />
            </Box>
          </Box>
          <Box direction="row" align="center">
            <Box pad="none" margin="none">
              <Title>Permit</Title>
              <SunBurst
                data={[
                  {
                    label: 'Export',
                    value: 150,
                    colorIndex: 'brand',
                    children: [
                      { label: 'Croco', value: 50, colorIndex: 'brand' },
                      { label: 'Snake', value: 50, colorIndex: 'brand' },
                      { label: 'Cats', value: 50, colorIndex: 'brand' }
                    ]
                  },
                  {
                    label: 'Re-Export',
                    value: 450,
                    colorIndex: 'critical',
                    children: [
                      { label: 'Croco', value: 150, colorIndex: 'critical' },
                      { label: 'Snake', value: 150, colorIndex: 'critical' },
                      { label: 'Cats', value: 150, colorIndex: 'critical' }
                    ]
                  },
                  {
                    label: 'Import',
                    value: 150,
                    colorIndex: 'ok',
                    children: [
                      { label: 'Croco', value: 50, colorIndex: 'ok' },
                      { label: 'Snake', value: 50, colorIndex: 'ok' },
                      { label: 'Cats', value: 50, colorIndex: 'ok' }
                    ]
                  },
                  {
                    label: 'Other',
                    value: 50,
                    colorIndex: 'warning',
                    children: [
                      { label: 'Croco', value: 10, colorIndex: 'warning' },
                      { label: 'Snake', value: 20, colorIndex: 'warning' },
                      { label: 'Cats', value: 20, colorIndex: 'warning' }
                    ]
                  }
                ]}
              />
            </Box>
            <Legend
              series={[
                { label: 'on target', colorIndex: 'neutral-1' },
                { label: 'over', colorIndex: 'neutral-2' },
                { label: 'under', colorIndex: 'neutral-3' }
              ]}
            />
          </Box>
        </Box>
      </Box>
    )
  }
}

Analytics.propTypes = {
  accounts: PropTypes.object,
  analyticsTitle: PropTypes.string,
  permitTotal: PropTypes.number,
  series: PropTypes.array
}

Analytics.contextTypes = {
  drizzle: PropTypes.object
}

export default Analytics
