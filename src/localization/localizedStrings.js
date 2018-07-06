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
        createPermit: 'Create Permit'
      },
      analytics: 'Analytics',
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
    addAddress: {
      addingPending: 'Adding addresses pending...',
      successfullyAdded: 'Successfully added addresses!',
      addingFailed: 'Adding addresses has failed.',
      invalidInputError:
        'Invalid input. Make sure all addresses are valid Ethereum addresses and that you have selected a country',
      addMoreAddresses: 'Add more addresses',
      goToWhitelist: 'Go to whitelist',
      addNewAddresses: 'Add new addresses',
      whitelisting: 'Whitelisting',
      country: 'Country',
      addAddressesToWhitelist: 'Add Addresses to Whitelist',
      ownerNotLoggedInError:
        'Adding addresses to the Whitelist is only possible when logged in as an Owner'
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
      permitNumber: 'Permit number',
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
      type: 'Typ',
      permitType: 'Permit type',
      exName: 'Name of exporter',
      exStreet: 'Street of exporter',
      exCity: 'City of exporter',
      imName: 'Name of importer',
      imStreet: 'Street of importer',
      imCity: 'City of importer',
      specimens: 'Specimens',
      addSpecies: 'Add species',
      commonName: 'Common name',
      scientificName: 'Scientific name',
      description: 'Description',
      quantity: 'Quantity',
      originPermitNumber: 'Number of origin permit',
      reExportPermitNumber: 'Number of last re-exprt permit',
      createPermit: 'Create permit',
      species: 'Species',
      importFromXML: 'Import from XML'
    }
  },
  de: {
    header: {
      whitelist: 'Whitelist',
      whitelistMenu: {
        whitelist: 'Whitelist',
        whitelistAdd: 'Adresse hinzufügen'
      },
      permits: 'Genehmigungen',
      permitsMenu: {
        listPermits: 'Genehmigungen auflisten',
        createPermit: 'Genehmigung erstellen'
      },
      analytics: 'Analyse',
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
    addAddress: {
      addingPending: 'Adresse wird hinzugefügt...',
      successfullyAdded: 'Adresse erfolgreich hinzugefügt!',
      addingFailed: 'Das Hinzufügen der Adresse ist fehlgeschlagen.',
      invalidInputError:
        'Ungültige Eingabe. Überprüfen Sie, dass alle Adressen gültige Ethereum Adressen sind \
        und dass Sie ein Land ausgewählt haben',
      addMoreAddresses: 'Mehr Adressen hinzufügen',
      goToWhitelist: 'Zur Whiteliste gehen',
      addNewAddresses: 'Neue Adressen hinzufügen',
      whitelisting: 'Whitelisting',
      country: 'Land',
      addAddressesToWhitelist: 'Adressen zur Whitelist hinzufügen',
      ownerNotLoggedInError:
        'Sie können Adressen nur zur Whitelist hinzufügen, wenn Sie als Controller eingeloggt sind'
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
      permits: 'Genehmigungen',
      permitNumber: 'Genehmigungs-Nr.',
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
      type: 'Typ',
      permitType: 'Permittyp',
      exName: 'Name des Exporters',
      exStreet: 'Straße des Exporters',
      exCity: 'Stadt des Exporters',
      imName: 'Name des Importers',
      imStreet: 'Straße des Importers',
      imCity: 'Stadt des Importers',
      specimens: 'Spezien',
      addSpecies: 'Spezies hinzufügen',
      commonName: 'Allgemeiner Name',
      scientificName: 'Wissenschaftlicher Name',
      description: 'Beschreibung',
      quantity: 'Anzahl',
      originPermitNumber: 'Nummer der Ursprungsgenehmigung',
      reExportPermitNumber: 'Nummer der letzten Re-Exportgenehmigung',
      createPermit: 'Permit erstellen',
      species: 'Spezies',
      importFromXML: 'Durch XML importieren'
    }
  }
})

export default local
