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

export const PERMITS_TABLE_HEADER_LABELS = [
  'permitHash',
  'exportCountry',
  'importCountry',
  'timestamp',
  'status'
]

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

/**
 * Fetches event logs from the PermitFactory contract.
 * @param {object} permitFactory A web3 instance of the PermitFactory contract.
 * @param {string} eventName Name of the event log -> `PermitCreated` or `PermitConfirmed`.
 * @param {number} fromBlock Start of block range for query.
 * @returns An array of formatted PermitFactory event logs.
 */
export async function getPermitEvents(permitFactory, eventName, fromBlock = 0) {
  const events = await permitFactory.getPastEvents(eventName, { fromBlock })
  return events.map(e => _formatEvent(e))
}

/**
 * Fetches event logs from the Whitelist contract.
 * @param {object} permitFactory A web3 instance of the Whitelist contract.
 * @param {string} eventName Name of the event log -> `AddressWhitelisted` or AddressRemoved`.
 * @param {number} fromBlock Start of block range for query.
 * @returns An array of formatted Whitelist event logs.
 */
export async function getWhitelistEvents(
  permitFactory,
  eventName,
  fromBlock = 0
) {
  const events = await permitFactory.getPastEvents(eventName, { fromBlock })
  return events.map(e => _formatWhitelistEvent(e))
}

/**
 * Formats an event log of the PermitFactory contract. Only for internal use.
 * @param {object} permitEvent Unformatted PermitFactory event log.
 * @returns Formatted event log.
 */
function _formatEvent(permitEvent) {
  const { blockNumber, event, returnValues } = permitEvent
  const { permitHash, exportCountry, importCountry } = returnValues
  let status = 'created'
  if (event !== 'PermitCreated') {
    status = returnValues.isAccepted ? 'confirmed' : 'declined'
  }
  return {
    event,
    blockNumber,
    permitHash,
    status,
    exportCountry: utils.hexToUtf8(exportCountry),
    importCountry: utils.hexToUtf8(importCountry)
  }
}

/**
 * Formats an event log of the Whitelist contract. Only for internal use.
 * @param {object} permitEvent Unformatted Whitelist event log.
 * @returns Formatted event log for whitelist.
 */
function _formatWhitelistEvent(permitEvent) {
  const { blockNumber, event, returnValues } = permitEvent
  const { added, removed, country } = returnValues
  return {
    event,
    blockNumber,
    address: event === 'AddressWhitelisted' ? added : removed,
    country: utils.hexToUtf8(country)
  }
}

/**
 * Formats the block number of events to the corresponding UNIX timestamps.
 * @param {object} web3 A web3 instance.
 * @param {Array} events Array of events with blocknumber attribute.
 * @returns {Promise<number[]>} Array of events with UNIX timestamps in ms.
 */
export async function blockNumberToUnix(web3, events) {
  const blocks = await Promise.all(
    events.map(e => web3.eth.getBlock(e.blockNumber, false))
  )
  return events.map((e, i) => ({
    ...e,
    // convert seconds into miliseconds
    timestamp: blocks[i].timestamp * 1000
  }))
}

/**
 * Merges two event arrays. Overwrites an event if a second event with an status change is given.
 * @param {Array} oldEvents Array of current event logs.
 * @param {Array} newEvents Array of new event lgos.
 * @returns Array of merged events where only one event exists per address.
 */
export function mergeWhitelistEvents(oldEvents, newEvents) {
  const mergedEvents = newEvents.concat(oldEvents)
  return Object.values(
    mergedEvents.reduce((c, { event, blockNumber, address, country }) => {
      c[address] = c[address] || {
        address: address,
        blockNumber: blockNumber,
        event: event,
        country: country
      }
      if (c[address].blockNumber < blockNumber) {
        c[address].blockNumber = blockNumber
        c[address].event = event
      }
      return c
    }, {})
  )
}

/**
 * Merges two event arrays. Overwrites an event if a second event with status `processed` is given.
 * @param {Array} oldEvents Array of current event logs.
 * @param {Array} newEvents Array of new event lgos.
 * @returns Array of merged events where only one event exists per permit hash.
 */
export function mergePermitEvents(oldEvents, newEvents) {
  const mergedEvents = newEvents.concat(oldEvents)
  return mergedEvents.reduce((result, current) => {
    const index = result.findIndex(
      elem => elem.permitHash === current.permitHash
    )
    if (index === -1) {
      result.push(current)
    } else if (current.status !== 'created') {
      result.splice(index, 1)
      result.push(current)
    }
    return result
  }, [])
}

export function sortPermitEvents(events, attribute, ascending) {
  return events.sort((a, b) => {
    if (attribute === 'permitHash' || attribute === 'timestamp') {
      return ascending
        ? a[attribute] - b[attribute]
        : b[attribute] - a[attribute]
    } else {
      if (a[attribute] < b[attribute]) {
        return ascending ? -1 : 1
      }
      if (a[attribute] > b[attribute]) {
        return ascending ? 1 : -1
      }
      return 0
    }
  })
}

export function isValidPermitHash(hash) {
  if (hash.substr(0, 2) === '0x') {
    return hash.length === 66 && utils.isHex(hash)
  }
  return hash.length === 64 && utils.isHex(hash)
}
