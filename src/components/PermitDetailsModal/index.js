import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Article, Layer, Box, Columns, Title, Timestamp } from 'grommet'

/**
 * Component for detailed permit information
 */
class PermitDetailsModal extends Component {
  render() {
    const { permit, onClose } = this.props
    return (
      <Layer closer={true} overlayClose={true} onClose={() => onClose()}>
        <Article size={'large'}>
          <Box
            direction={'row'}
            justify={'center'}
            pad={{ vertical: 'medium' }}>
            <Title>Permit details</Title>
          </Box>
          <Columns justify={'between'} size={'small'}>
            <Box margin={{ vertical: 'small' }}>
              <b>Type</b>
              {permit.permitType}
            </Box>
            <Box margin={{ vertical: 'small' }}>
              <b>Id</b>
              {permit.permitHash}
            </Box>
          </Columns>
          <Columns justify={'between'} size={'small'}>
            <Box margin={{ vertical: 'small' }}>
              <b>Country of export</b>
              {permit.exportCountry}
            </Box>
            <Box margin={{ vertical: 'small' }}>
              <b>Country of import</b>
              {permit.importCountry}
            </Box>
          </Columns>
          <Columns justify={'between'} size={'small'}>
            <Box margin={{ vertical: 'small' }}>
              <b>Exporter</b>
              {permit.exporter.name} <br />
              {permit.exporter.street} <br />
              {permit.exporter.city}
            </Box>
            <Box margin={{ vertical: 'small' }}>
              <b>Importer</b>
              {permit.importer.name} <br />
              {permit.importer.street} <br />
              {permit.importer.city}
            </Box>
          </Columns>
          <Columns justify={'between'} size={'small'}>
            <Box margin={{ vertical: 'small' }}>
              <b>Timestamp</b>
              <Timestamp value={permit.timestamp} />
            </Box>
            <Box margin={{ vertical: 'small' }}>
              <b>Status</b>
              {permit.status}
            </Box>
          </Columns>
          {permit.specimens.map((specimen, i) => (
            <Box key={i} margin={{ vertical: 'medium' }}>
              <hr />
              <Box
                direction={'row'}
                justify={'center'}
                pad={{ vertical: 'medium' }}>
                <Title>{`Specimen ${i + 1}`}</Title>
              </Box>
              <Columns justify={'between'} size={'small'}>
                <Box margin={{ vertical: 'small' }}>
                  <b>Common name</b>
                  {specimen.commonName}
                </Box>
                <Box margin={{ vertical: 'small' }}>
                  <b>Sc. name</b>
                  {specimen.scientificName}
                </Box>
              </Columns>
              <Columns justify={'between'} size={'small'}>
                <Box margin={{ vertical: 'small' }}>
                  <b>Description</b>
                  {specimen.description}
                </Box>
                <Box margin={{ vertical: 'small' }}>
                  <b>Quantity</b>
                  {specimen.quantity}
                </Box>
              </Columns>
              <Columns justify={'between'} size={'small'}>
                <Box margin={{ vertical: 'small' }}>
                  <b>Origin</b> {specimen.originHash}
                </Box>
                <Box margin={{ vertical: 'small' }}>
                  <b>Last re-export</b> {specimen.reExportHash}
                </Box>
              </Columns>
            </Box>
          ))}
          <Box
            direction={'row'}
            justify={'center'}
            pad={{ vertical: 'medium' }}>
            {this.props.detailsActions}
          </Box>
        </Article>
      </Layer>
    )
  }
}

PermitDetailsModal.propTypes = {
  permit: PropTypes.object,
  onClose: PropTypes.func,
  detailsActions: PropTypes.any
}

export default PermitDetailsModal
