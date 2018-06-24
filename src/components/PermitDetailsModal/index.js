import React, { Component } from 'react'
import PropTypes from 'prop-types'
import dateformat from 'dateformat'
import {
  Article,
  Button,
  Layer,
  Box,
  Columns,
  Title,
  Timestamp,
  PrintIcon
} from 'grommet'
import PrintTemplate from '../../templates/print_template.html'
import { trimHash } from '../../util/stringUtils'

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
              {trimHash(permit.permitHash)}
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
                  <b>Origin</b>
                  {trimHash(specimen.originHash)}
                </Box>
                <Box margin={{ vertical: 'small' }}>
                  <b>Last re-export</b>
                  {trimHash(specimen.reExportHash)}
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
          <Box
            direction={'row'}
            justify={'center'}
            pad={{ vertical: 'medium' }}>
            <Button
              icon={<PrintIcon />}
              label={'Print Permit'}
              onClick={() => {
                this.printPermit(permit)
              }}
            />
          </Box>
        </Article>
      </Layer>
    )
  }

  printPermit(permit) {
    let fieldPlaceholder = '*******'
    let defaultHash =
      '0x0000000000000000000000000000000000000000000000000000000000000000'
    var html = PrintTemplate
    var wnd = window.open()
    // Set cross on paper depending on permit type
    if (permit.permitType === 'EXPORT') {
      html = html.replace('###EXPORT###', 'x')
      html = html.replace('###REEXPORT###', '')
      html = html.replace('###OTHERTYPE###', '')
    } else if (permit.permitType === 'RE-EXPORT') {
      html = html.replace('###REEXPORT###', 'x')
      html = html.replace('###EXPORT###', '')
      html = html.replace('###OTHERTYPE###', '')
    } else if (permit.permitType === 'OTHER') {
      html = html.replace('###OTHERTYPE###', 'x')
      html = html.replace('###REEXPORT###', '')
      html = html.replace('###EXPORT###', '')
    }
    // Set Import data
    html = html.replace('###IMPORTCOUNTRY###', permit.importCountry)
    html = html.replace('###IMPORTERNAME###', permit.importer.name)
    html = html.replace('###IMPORTERADDRESS###', permit.importer.street)
    html = html.replace('###IMPORTERCITY###', permit.importer.city)

    // Set Export data
    html = html.replace('###EXPORTCOUNTRY###', permit.exportCountry)
    html = html.replace('###EXPORTERNAME###', permit.exporter.name)
    html = html.replace('###EXPORTERADDRESS###', permit.exporter.street)
    html = html.replace('###EXPORTERCITY###', permit.exporter.city)

    // Set the species data
    let formSections = [0, 1, 2]
    formSections.forEach(index => {
      //Check if there are values to fill into the form
      let emptyFields = permit.specimens[index] === undefined
      html = html.replace(
        '###SPECIMEN-SCIENTIFICNAME-' + index + '###',
        emptyFields ? fieldPlaceholder : permit.specimens[index].scientificName
      )
      html = html.replace(
        '###SPECIMEN-COMMONNAME-' + index + '###',
        emptyFields ? fieldPlaceholder : permit.specimens[index].commonName
      )
      html = html.replace(
        '###SPECIMEN-DESCRIPTION-' + index + '###',
        emptyFields ? fieldPlaceholder : permit.specimens[index].description
      )
      html = html.replace(
        '###SPECIMEN-QUANTITY-' + index + '###',
        emptyFields ? fieldPlaceholder : permit.specimens[index].quantity
      )
      html = html.replace(
        '###SPECIMEN-LAST-RE-EXPORT-' + index + '###',
        emptyFields
          ? fieldPlaceholder
          : permit.specimens[index].reExportHash === defaultHash
            ? fieldPlaceholder
            : trimHash(permit.specimens[index].reExportHash)
      )
      html = html.replace(
        '###SPECIMEN-ORIGIN-' + index + '###',
        emptyFields
          ? fieldPlaceholder
          : permit.specimens[index].originHash === defaultHash
            ? fieldPlaceholder
            : trimHash(permit.specimens[index].originHash)
      )
      html = html.replace(
        '###SPECIMEN-PERMIT-NUMBER-' + index + '###',
        emptyFields
          ? fieldPlaceholder
          : trimHash(permit.specimens[index].permitHash)
      )
      html = html.replace(
        '###SPECIMEN-CERTIFICATE-NUMBER-' + index + '###',
        fieldPlaceholder
      )
      html = html.replace(
        '###SPECIMEN-LAST-RE-EXPORT-DATE-' + index + '###',
        fieldPlaceholder
      )
      html = html.replace(
        '###SPECIMEN-ORIGIN-DATE-' + index + '###',
        fieldPlaceholder
      )
    })

    //Set Permit Number
    html = html.replace('###PERMIT-NUMBER###', trimHash(permit.permitHash))

    //Set Date Of Issue
    html = html.replace(
      '###DATE-OF-ISSUE####',
      this.getTimestampFormattedForPrintedVersion(permit.timestamp)
    )

    //Write them into the document
    wnd.document.write(html)
    wnd.document.close()
    wnd.print()
  }

  getTimestampFormattedForPrintedVersion(timestamp) {
    return dateformat(Date(timestamp), 'dd.mm.yyyy')
  }
}

PermitDetailsModal.propTypes = {
  permit: PropTypes.object,
  onClose: PropTypes.func,
  detailsActions: PropTypes.any
}

export default PermitDetailsModal
