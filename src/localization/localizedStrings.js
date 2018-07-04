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
      permit: 'Permit',
      permits: 'Permits',
      permitDetails: 'Permit details',
      permitNumber: 'Permit number',
      id: 'Id',
      countryOfExport: 'Country of export',
      countryOfImport: 'Country of import',
      lastUpdate: 'Last update',
      status: 'Status',
      from: 'From',
      to: 'To',
      searchPlaceholder: 'Search for permit number',
      created: 'created',
      processed: 'processed',
      originHashPlaceholder: 'Search for number of origin permit',
      reExportPlaceholder: 'Search for number of last re-export permit',
      lastReExport: 'Last re-export',
      type: 'Type',
      permitType: 'Permit type',
      exName: 'Name of exporter',
      exStreet: 'Street of exporter',
      exCity: 'City of exporter',
      exporter: 'Exporter',
      imName: 'Name of importer',
      imStreet: 'Street of importer',
      imCity: 'City of importer',
      importer: 'Importer',
      timestamp: 'Timestamp',
      specimens: 'Specimens',
      addSpecies: 'Add species',
      commonName: 'Common name',
      scientificName: 'Scientific name',
      description: 'Description',
      quantity: 'Quantity',
      originPermitNumber: 'Number of origin permit',
      origin: 'Origin',
      reExportPermitNumber: 'Number of last re-exprt permit',
      createPermit: 'Create permit',
      species: 'Species',
      downloadAsXML: 'Download as XML',
      printPermit: 'Print permit'
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
      permit: 'Genehmigung',
      permitDetails: 'Genehmigungsdetails',
      permits: 'Genehmigungen',
      permitNumber: 'Genehmigungs-Nr.',
      id: 'Id',
      countryOfExport: 'Exportland',
      countryOfImport: 'Importland',
      lastUpdate: 'Letztes Update',
      status: 'Status',
      from: 'Von',
      to: 'Bis',
      searchPlaceholder: 'Nach Genehmigungs-Nr. suchen',
      created: 'erstellt',
      processed: 'bearbeitet',
      originHashPlaceholder: 'Nach Nummer der Ursprungsgenehmigung suchen',
      reExportPlaceholder:
        'Nach Nummer der letzten Re-Exportgenehmigung suchen',
      lastReExport: 'Letzter Re-Export',
      type: 'Typ',
      permitType: 'Permittyp',
      exName: 'Name des Exporteurs',
      exStreet: 'Straße des Exporteurs',
      exCity: 'Stadt des Exporteurs',
      exporter: 'Exporteur',
      imName: 'Name des Importeurs',
      imStreet: 'Straße des Importeurs',
      imCity: 'Stadt des Importeurs',
      importer: 'Importeur',
      timestamp: 'Zeitstempel',
      specimens: 'Spezien',
      addSpecies: 'Spezies hinzufügen',
      commonName: 'Allgemeiner Name',
      scientificName: 'Wissenschaftlicher Name',
      description: 'Beschreibung',
      quantity: 'Anzahl',
      originPermitNumber: 'Nummer der Ursprungsgenehmigung',
      origin: 'Ursprung',
      reExportPermitNumber: 'Nummer der letzten Re-Exportgenehmigung',
      createPermit: 'Permit erstellen',
      species: 'Spezies',
      downloadAsXML: 'XML herunterladen',
      printPermit: 'Genehmigung drucken'
    }
  }
})

export default local
