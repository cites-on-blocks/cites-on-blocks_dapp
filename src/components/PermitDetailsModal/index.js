import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  Article,
  Button,
  DownloadIcon,
  Layer,
  Box,
  Columns,
  Title,
  Timestamp,
  PrintIcon
} from 'grommet'
import PrintTemplate from '../../templates/print_template.html'
import { trimHash } from '../../util/stringUtils'
import dateformat from 'dateformat'
import fileDownload from 'js-file-download'
import local from '../../localization/localizedStrings'
import { getPermitAsXMLFromExporterURL } from '../../util/exporterUtils'
import axios from 'axios'

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
            <Title>{local.permits.permitDetails}</Title>
          </Box>
          <Columns justify={'between'} size={'small'}>
            <Box margin={{ vertical: 'small' }}>
              <b>{local.permits.type}</b>
              {permit.permitType}
            </Box>
            <Box margin={{ vertical: 'small' }}>
              <b>{local.permits.id}</b>
              {trimHash(permit.permitHash)}
            </Box>
          </Columns>
          <Columns justify={'between'} size={'small'}>
            <Box margin={{ vertical: 'small' }}>
              <b>{local.permits.countryOfExport}</b>
              {permit.exportCountry}
            </Box>
            <Box margin={{ vertical: 'small' }}>
              <b>{local.permits.countryOfImport}</b>
              {permit.importCountry}
            </Box>
          </Columns>
          <Columns justify={'between'} size={'small'}>
            <Box margin={{ vertical: 'small' }}>
              <b>{local.permits.exporter}</b>
              {permit.exporter.name} <br />
              {permit.exporter.street} <br />
              {permit.exporter.city}
            </Box>
            <Box margin={{ vertical: 'small' }}>
              <b>{local.permits.importer}</b>
              {permit.importer.name} <br />
              {permit.importer.street} <br />
              {permit.importer.city}
            </Box>
          </Columns>
          <Columns justify={'between'} size={'small'}>
            <Box margin={{ vertical: 'small' }}>
              <b>{local.permits.timestamp}</b>
              <Timestamp value={permit.timestamp} />
            </Box>
            <Box margin={{ vertical: 'small' }}>
              <b>{local.permits.status}</b>
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
                  <b>{local.permits.commonName}</b>
                  {specimen.commonName}
                </Box>
                <Box margin={{ vertical: 'small' }}>
                  <b>{local.permits.scientificName}</b>
                  {specimen.scientificName}
                </Box>
              </Columns>
              <Columns justify={'between'} size={'small'}>
                <Box margin={{ vertical: 'small' }}>
                  <b>{local.permits.description}</b>
                  {specimen.description}
                </Box>
                <Box margin={{ vertical: 'small' }}>
                  <b>{local.permits.quantity}</b>
                  {specimen.quantity}
                </Box>
              </Columns>
              <Columns justify={'between'} size={'small'}>
                <Box margin={{ vertical: 'small' }}>
                  <b>{local.permits.origin}</b>
                  {trimHash(specimen.originHash)}
                </Box>
                <Box margin={{ vertical: 'small' }}>
                  <b>{local.permits.lastReExport}</b>
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
            justify={'between'}
            pad={{ vertical: 'medium' }}>
            <Button
              icon={<DownloadIcon />}
              label={local.permits.downloadAsXML}
              onClick={() => {
                this.exportRequest(permit)
              }}
            />
            <Button
              icon={<PrintIcon />}
              label={local.permits.printPermit}
              onClick={() => {
                this.printPermit(permit)
              }}
            />
          </Box>
        </Article>
      </Layer>
    )
  }

  async exportRequest(permit) {
    console.warn('Start')
    try {
      let response = await axios.get(
        getPermitAsXMLFromExporterURL(permit.permitHash)
      )
      if (response.status === 200 || response.status === 201) {
        fileDownload(response.data, permit.permitHash + '.xml')
      } else {
        console.warn('#No valid XML returned#')
        console.warn(response)
      }
    } catch (error) {
      console.warn(error)
    }
  }

  printPermit(permit) {
    const fieldPlaceholder = '*******'
    const defaultHash =
      '0x0000000000000000000000000000000000000000000000000000000000000000'
    let html = PrintTemplate
    const wnd = window.open()
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
    const formSections = [0, 1, 2]
    formSections.forEach(index => {
      //Check if there are values to fill into the form
      const emptyFields = permit.specimens[index] === undefined
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
