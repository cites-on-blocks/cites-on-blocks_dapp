import { utils } from 'web3'

export const PERMIT_FORMS = ['DIGITAL', 'PAPER']

export const PERMIT_TYPES = ['EXPORT', 'RE-EXPORT', 'OTHER']

export const DEFAULT_SPECIMEN = {
  quantity: 0,
  scientificName: '',
  commonName: '',
  description: '',
  originHash: '',
  reExportHash: ''
}

export const DEFAULT_PERMIT = {
  exportCountry: '',
  importCountry: '',
  permitType: PERMIT_TYPES[0],
  importer: ['', '', ''],
  exporter: ['', '', '']
}

export function convertSpecimensToArrays(specimens) {
  return specimens.reduce(
    (result, specimen) => {
      result.quantities.push(specimen.quantity)
      result.scientificNames.push(specimen.scientificName)
      result.commonNames.push(specimen.commonName)
      result.descriptions.push(specimen.description)
      result.originHashes.push(specimen.originHash)
      result.reExportHashes.push(specimen.reExportHash)
      return result
    },
    {
      quantities: [],
      scientificNames: [],
      commonNames: [],
      descriptions: [],
      originHashes: [],
      reExportHashes: []
    }
  )
}

export function parseRawPermit(rawPermit) {
  return {
    exportCountry: utils.hexToUtf8(rawPermit[0]),
    importCountry: utils.hexToUtf8(rawPermit[1]),
    permitType: PERMIT_TYPES[rawPermit[2]],
    exporter: {
      name: utils.hexToUtf8(rawPermit[3][0]),
      street: utils.hexToUtf8(rawPermit[3][1]),
      city: utils.hexToUtf8(rawPermit[3][2])
    },
    importer: {
      name: utils.hexToUtf8(rawPermit[4][0]),
      street: utils.hexToUtf8(rawPermit[4][1]),
      city: utils.hexToUtf8(rawPermit[4][2])
    },
    specimenHashes: rawPermit[5],
    nonce: rawPermit[6]
  }
}

export function parseRawSpecimen(rawSpecimen) {
  return {
    permitHash: rawSpecimen[0],
    quantity: rawSpecimen[1],
    scientificName: utils.hexToUtf8(rawSpecimen[2]),
    commonName: utils.hexToUtf8(rawSpecimen[3]),
    description: utils.hexToUtf8(rawSpecimen[4]),
    originHash: rawSpecimen[5],
    reExportHash: rawSpecimen[6]
  }
}
