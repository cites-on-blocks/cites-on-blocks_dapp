export const BASE_EXPORTER_DEV_URL = 'https://localhost:8081/api/'
export const BASE_EXPORTER_PROD_URL = 'http://40.115.39.123:8080/api/'

export function getPermitAsXMLFromExporterURL(permitHash) {
  return getBaseExporterURL() + 'permit/' + permitHash
}

export function getBaseExporterURL() {
  if (process.env.NODE_ENV === 'production') {
    return BASE_EXPORTER_PROD_URL
  } else if (process.env.NODE_ENV === 'development') {
    return BASE_EXPORTER_DEV_URL
  } else {
    return undefined
  }
}
