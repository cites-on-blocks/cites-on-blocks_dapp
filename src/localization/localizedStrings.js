import LocalizedStrings from 'react-localization'

let local = new LocalizedStrings({
  en: {
    header: {
      whitelist: 'Whitelist',
      whitelistMenu: {
        whitelist: 'Whitelist',
        whitelistAdd: 'Add Address'
      },
      permits: 'Permits',
      permitsMenu: {
        listPermits: 'List Permits',
        createPermit: 'Create Permit',
        processPermit: 'Process Permit'
      },
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
      },
      layer: {
        number: 'Number',
        publicID: 'Public-ID',
        entry: 'created'
      },
      remove: 'Remove',
      removeSelected: 'Remove all selected',
      whitelisted: 'whitelisted',
      notWhitelisted: 'not whitelisted',
      add: 'Add',
      status: 'Status'
    },
    help: {
      headline: 'Help',
      accordionHeadline: 'Most frequent questions',
      first: 'What is the blockchain?',
      second: 'What is cites?',
      third: 'How can I contact cites?',
      fourth: 'This is Nr. 4',
      contact: 'Contact us'
    },
    footer: {
      openingDays: 'Monday to Saturday',
      openingHours: '7 am - 9 pm E.T.',
      contactPhone: '(1-⁠844-⁠627-⁠2871)',
      officeName: 'Cites Office:'
    },
    permits: {
      permits: 'permits',
      permitNumber: 'Permit number',
      countryOfExport: 'Country of export',
      countryOfImport: 'Country of import',
      lastUpdate: 'Last update',
      status: 'Status'
    }
  },
  de: {
    header: {
      whitelist: 'Whitelist',
      permits: 'Genehmigungen',
      permitsMenu: {
        listPermits: 'Genehmigungen auflisten',
        createPermit: 'Genehmigung erstellen',
        processPermit: 'Genehmigung verarbeiten'
      },
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
      },
      layer: {
        number: 'Nummer',
        publicID: 'Public-ID',
        entry: 'erstellt am'
      },
      remove: 'Entfernen',
      removeSelected: 'Alle Markierten entfernen',
      whitelisted: 'Auf der Whitelist',
      notWhitelisted: 'Nicht auf der Whitelist',
      add: 'Hinzufügen',
      status: 'Status'
    },
    help: {
      headline: 'Hilfe',
      accordionHeadline: 'Häufigste Fragen',
      first: 'Was ist die Blockchain>',
      second: 'Was ist Cites?',
      third: 'Wie kann ich cites kontaktieren?',
      fourth: 'Frage Nr. 4',
      contact: 'Kontaktieren Sie uns'
    },
    footer: {
      openingDays: 'Montag bis Samstag',
      openingHours: '7 - 21 Uhr E.T.',
      contactPhone: '(1-⁠844-⁠627-⁠2871)',
      officeName: 'Cites Büro:'
    },
    permits: {
      permits: 'Genehmigungen',
      permitNumber: 'Genehmigungs-Nr.',
      countryOfExport: 'Exportland',
      countryOfImport: 'Importland',
      lastUpdate: 'Letztes Update',
      status: 'Status'
    }
  }
})

export default local
