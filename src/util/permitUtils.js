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

export function convertSpecimensToArrays(specimens) {
  return specimens.reduce(
    (result, specimen) => {
      result.quantities.push(specimen.quantity)
      result.scientificNames.push(specimen.scientificName)
      result.commonNames.push(specimen.commonName)
      result.descriptions.push(specimen.description)
      result.originHashes.push(specimen.originHash)
      result.reExportHashes.push(specimen.reExportHash)
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
