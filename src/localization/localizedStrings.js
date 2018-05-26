import LocalizedStrings from 'react-localization'

let local = new LocalizedStrings({
  en: {
    header: {
      whitelist: 'Whitelist',
      permits: 'Permits',
      analytics: 'Analytics',
      importExport: 'Import/Export',
      help: 'Help'
    },
    whitelist: {
      headline: 'official country list of all import/export permission',
      table: {
        country: 'name',
        language: 'language',
        iso: 'ISO',
        region: 'region',
        joining: 'Date of joining',
        entry: 'Entry into force'
      }
    },
    footer: {
      openingDays: 'Monday to Saturday',
      openingHours: '7 am - 9 pm E.T.',
      contactPhone: '(1-⁠844-⁠627-⁠2871)',
      officeName: 'Cites Office:'
    }
  },
  de: {
    header: {
      whitelist: 'Whitelist',
      permits: 'Genehmigungen',
      analytics: 'Analyse',
      importExport: 'Import/Export',
      help: 'Hilfe'
    },
    whitelist: {
      headline: 'offizielle Liste aller Länder mit Export/Import-Erlaubnis',
      table: {
        country: 'Name',
        language: 'Sprache',
        iso: 'ISO',
        region: 'Region',
        joining: 'Beitrittsdatum',
        entry: 'Aufnahmedatum'
      }
    },
    footer: {
      openingDays: 'Montag bis Samstag',
      openingHours: '7 - 21 Uhr E.T.',
      contactPhone: '(1-⁠844-⁠627-⁠2871)',
      officeName: 'Cites Büro:'
    }
  }
})

export default local
