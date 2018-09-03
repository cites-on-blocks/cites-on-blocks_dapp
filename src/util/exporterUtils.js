import exporterConfig from '../config/exporterConfig'

export function getPermitAsXMLFromExporterURL(permitHash) {
  return getBaseExporterURL() + 'permit/' + permitHash
}

export function getBaseExporterURL() {
  if (process.env.NODE_ENV === 'production') {
    return exporterConfig.BASE_EXPORTER_PROD_URL
  } else if (process.env.NODE_ENV === 'development') {
    return exporterConfig.BASE_EXPORTER_DEV_URL
  } else {
    return undefined
  }
}
