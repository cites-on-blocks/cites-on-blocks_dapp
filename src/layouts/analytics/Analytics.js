import React, { Component } from 'react'
import PropTypes from 'prop-types'
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

class Analytics extends Component {
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
        <Sidebar colorIndex="light-2" fixed={false}>
          <Header pad="medium" justify="between">
            <Title>Title</Title>
          </Header>
          <Box flex="grow" justify="start">
            <Menu primary={true}>
              <Anchor className="active">First</Anchor>
              <Anchor>Second</Anchor>
              <Anchor>Third</Anchor>
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
          <Box direction="row" pad="small">
            <Box colorIndex="light-1" wrap={true} pad="none" margin="none">
              <Title>Permit</Title>
              <AnnotatedMeter
                label="Permit"
                type="circle"
                max={95}
                size="small"
                series={[
                  { label: 'Export', value: 20, colorIndex: 'brand' },
                  { label: 'Re-Export', value: 50, colorIndex: 'critical' },
                  { label: 'Import', value: 20, colorIndex: 'ok' },
                  { label: 'Others', value: 5, colorIndex: 'warning' }
                ]}
                legend={true}
              />
            </Box>
            <Box colorIndex="light-1" wrap={true} pad="none" margin="none">
              <Title>Worker</Title>
              <AnnotatedMeter
                type="circle"
                max={95}
                size="small"
                series={[
                  { label: 'Germany', value: 20, colorIndex: 'brand' },
                  { label: 'Denmark', value: 50, colorIndex: 'critical' },
                  { label: 'France', value: 20, colorIndex: 'ok' },
                  { label: 'South Afrika', value: 5, colorIndex: 'warning' }
                ]}
                legend={true}
              />
            </Box>
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
                legend={true}
              />
            </Box>
          </Box>
          <Box direction="row" align="center">
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
  accounts: PropTypes.object
}

export default Analytics