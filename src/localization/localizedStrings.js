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
        'Adding addresses to the Whitelist is only possible when logged in as an Owner',
      tryAgain: 'Try again'
    },
    help: {
      headline: 'Help',
      accordionHeadline: 'Frequently Asked Questions',
      first:
        'How can I know whether I need a permit to import or export wildlife specimens?',
      firstText:
        'Import, export and re-export of any live animal or plant of a species listed in the CITES Appendices' +
        ' (or of any part or derivative of such animal or plant) requires a permit or certificate. ' +
        'To find out whether a species is listed in the appendices, you can check in the CITES-listed species' +
        ' database of this website, using either the scientific name or the common name of the species. ' +
        'Alternatively, you can also check with the national agency (known as the "Management Authority") of ' +
        ' your country whether the species you are interested in needs a permit. ' +
        'They may be able to identify the species for you, if you are not sure what it is.',
      second:
        'Where can I find the contact details of the national agency in charge of the implementation of CITES?',
      secondText:
        'The national agency responsible for implementing CITES in each country is called the Management Authority. ' +
        'The contact details of each Management Authority can be found on the National contacts page on the offical ' +
        ' CITES website.',
      third: 'Do animals that were bred in captivity also require permits?',
      thirdText:
        'Yes. However, if a commercial breeder of a CITES Appendix-I species fulfils certain conditions and is' +
        ' registered with the CITES Secretariat, specimens from the breeding operation may be treated as if they' +
        ' are of Appendix-II species, meaning that they can be traded commercially (permit requirement is not ' +
        'waived). If the animals were not bred for commercial purposes they may be traded simply with a ' +
        'certificate of captive breeding. Click here for further information.',
      fourth: 'What is the Blockchain?',
      fourthText:
        'Blockchain is the core technology behind crypto currencies. At its heart is a distributed data store.' +
        ' Anyone who participates in this network has their own data store that stores all of the transactions that' +
        ' ever happened on the network (this is also known as the distributed ledger).' +
        ' Entries are stored within a cryptographic chain of blocks. At every stage, the network of participants ' +
        'must agree about the latest block of transactions. ' +
        'Agreement is reached through a process of majority consensus, eliminating duplicate entries, ' +
        'double spending etc. This process and the cryptographic layering of the blocks makes the agreed ' +
        'blockchain irreversible and immutable. The ‘history’ of events within this technology cannot be ' +
        'modified by any one of the participants without majority consensus from the group.',
      contact: 'Contact us',
      contactName: 'Name',
      contactMail: 'E-Mail',
      contactText: 'Text',
      contactSend: 'SEND'
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
      importFromXML: 'Import from XML',
      decline: 'Decline',
      confirm: 'Confirm'
    },
    permitCreate: {
      pending: 'Permit creation pending...',
      successful: 'Permit creation successful!',
      failed: 'Permit creation has failed.',
      noXMLImportError:
        'The file you are trying to upload is not an XML document. Please make sure your file has the correct type',
      goToPermit: 'Go to permit',
      newPermit: 'New permit',
      tryAgain: 'Try again'
    },
    analytics: {
      headline: 'Analytics',
      menu: 'Dashboard',
      country: 'Country',
      map: 'Map',
      permitChart: {
        headline: 'Permit',
        export: 'Export',
        reExport: 'Re-Export',
        import: 'Import',
        other: 'Others',
        analyticsTitle: 'Permit Chart',
        analyticText:
          'This chart displays all the different permit types in relation to the total count of permits.'
      },
      workChart: {
        headline: 'Worker',
        analyticsTitle: 'Worker Chart',
        analyticCountryText:
          'This chart displays all the worker of an country and split them into "whitelited" and "removed".',
        analyticText:
          'This chart displays all the worker count per country in relation to the total count of worker.'
      },
      specimensChart: {
        headline: 'Species',
        analyticsTitle: 'Species Chart',
        analyticText:
          'This chart displays all the different species in relation to the total count of permits'
      },
      sunburstChart: {
        headline: 'Permit per Country',
        headlineCountry: 'Specimens per Permit-Type',
        analyticsTitle: 'Country Chart',
        legend: 'Countries',
        legendCountry: 'Permit Type',
        analyticCountryText:
          'This chart displays all different permit types and count there specific species of each permit.',
        analyticText:
          'This chart displays all the countries and there specific permits in relation to the total count of permits'
      }
    },
    error: 'Error. Please load the page again.'
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
        'Sie können Adressen nur zur Whitelist hinzufügen, wenn Sie als Controller eingeloggt sind',
      tryAgain: 'Wiederholen'
    },
    help: {
      headline: 'Hilfe',
      accordionHeadline: 'Häufigste Fragen',
      first:
        'Woher weiß ich, ob ich eine Genehmigung für den Import oder Export von wilden Tieren benötige?',
      firstText:
        'Die Einfuhr, Ausfuhr und Wiederausfuhr lebendiger Tiere oder Pflanzen einer auf der CITES-Anlage ' +
        ' aufgeführten Art (oder eines Teils oder Derivats eines solchen Tieres oder einer solchen Pflanze) ' +
        'erfordert eine Genehmigung oder ein Zertifikat. Um herauszufinden, ob eine Art aufgelistet ist, ' +
        ' können Sie in der CITES Artendatenbank entweder den wissenschaftlichen Namen oder den gebräuchlichen' +
        ' Namen der Art eingeben. Alternativ können Sie auch bei der nationalen Behörde Ihres Landes ' +
        ' (der "Verwaltungsbehörde") nachfragen, ob die von Ihnen gewünschte Art eine Genehmigung benötigt. ' +
        ' Sie können die Art für Sie identifizieren lassen, wenn Sie nicht sicher sind, welche es ist.',
      second:
        'Wo finde ich die Kontaktdaten der nationalen Agentur, die für die Umsetzung ' +
        'der CITES Anforderungen ständig ist?',
      secondText:
        'Die nationale Agentur, die in jedem Land für die Umsetzung der CITES Anforderungen verantwortlich ' +
        ' ist, wird als Verwaltungsbehörde bezeichnet. Die Kontaktdaten der einzelnen Verwaltungsbehörden ' +
        'sind auf der offizielen CITES Website zu finden.',
      third:
        'Benötigen Tiere, die in Gefangenschaft gezüchtet wurden, auch eine Genehmigungen?',
      thirdText:
        'Ja. Wenn jedoch ein kommerzieller Züchter bestimmte Bedingungen für die Zucht einer Art aus ' +
        ' dem Anhang I erfüllt und beim CITES-Sekretariat registriert ist, können Exemplare aus dem ' +
        ' Zuchtbetrieb so behandelt werden, als kämen sie aus dem Arten Anhang II, was bedeutet, dass sie ' +
        ' kommerziell gehandelt werden können (Genehmigungspflicht wird nicht erlassen).' +
        'Wenn die Tiere nicht für kommerzielle Zwecke gezüchtet wurden, können sie einfach mit ' +
        ' einer Bescheinigung der Zucht in Gefangenschaft gehandelt werden. Für weitere Informationen gehen ' +
        'Sie auf die offizielle CITES Webseite.',
      fourth: 'Was ist eine Blockchain?',
      fourthText:
        'Im Kern ist die Blockchain eine verteilter Datenspeicher. Jeder, der an diesem Netzwerk teilnimmt, ' +
        'hat seinen eigenen Datenspeicher, der alle Transaktionen speichert, die jemals im Netzwerk ausgeführt wurden' +
        ' (dies wird auch als verteiltes Hauptbuch bezeichnet). Transaktionen werden in einer kryptografischen ' +
        ' Blockkette gespeichert. In jeder Phase muss sich das Teilnehmernetz über den letzten ' +
        ' Transaktionsblock einigen. Die Einigung wird durch einen Mehrheitskonsens erreicht, der Doppeleinträge, ' +
        ' Doppelausgaben usw. eliminiert. Dieser Prozess und die kryptographische Schichtung der Blöcke macht die ' +
        'vereinbarte Blockkette irreversibel und unveränderlich. Die "Geschichte" der Ereignisse innerhalb dieser ' +
        ' Technologie kann von keinem der Teilnehmer ohne Mehrheitskonsens von der Gruppe geändert werden.',
      contact: 'Kontaktiere uns',
      contactName: 'Name',
      contactMail: 'E-Mail',
      contactText: 'Text',
      contactSend: 'SENDEN'
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
      importFromXML: 'Durch XML importieren',
      decline: 'Ablehnen',
      confirm: 'Bestätigen'
    },
    permitCreate: {
      pending: 'Genehmigung wird erstellt...',
      successful: 'Genehmigung wurde erfolgreich erstellt!',
      failed: 'Die Erstellung der Genehmigung ist fehlgeschlagen.',
      noXMLImportError:
        'Die von Ihnen hochgeladene Datei ist keine XML-Datei. Bitte laden Sie eine Datei mit dem richtigen Typ hoch',
      goToPermit: 'Gehe zur Genehmigung',
      newPermit: 'Neue Genehmigung',
      tryAgain: 'Wiederholen'
    },
    analytics: {
      headline: 'Analyse',
      menu: 'Dashboard',
      country: 'Land',
      map: 'Karte',
      permitChart: {
        headline: 'Genehmigung',
        export: 'Export',
        reExport: 'Re-Export',
        import: 'Import',
        analyticsTitle: 'Genehmigungsdiagramm',
        other: 'Anderes',
        analyticText:
          'Dieses Diagramm zeigt alle Genehmigungsarten im Verhältnis zur Gesamtanzahl an Genehmigungen'
      },
      workChart: {
        headline: 'Arbeiter',
        analyticsTitle: 'Mitarbeiter Diagramm',
        analyticText:
          'Dieses Diagramm zeigt alle Mitarbeiter pro Land im Verhältnis zur Gesamtanzahl an',
        analyticCountryText:
          'Dieses Diagramm gruppiert alle Mitarbeiter eines Landes in "whitelisted" und "removed".'
      },
      specimensChart: {
        headline: 'Spezien',
        analyticsTitle: 'Spezien Diagramm',
        analyticText:
          'Dieses Diagramm zeigt die gesamte Anzahl an Spezien im Verhältnis zur Gesamtanzahl an'
      },
      sunburstChart: {
        headline: 'Genehmigungen pro Land',
        headlineCountry: 'Spezies pro Genehmigungsart',
        legend: 'Länder',
        legendCountry: 'Genehmigungsart',
        analyticCountryText:
          'Dieses Diagramm gruppiert alle Genehmigungsarten und zeigt die spezifischen Spezien je Genehmigungsart.',
        analyticText:
          'Dieses Diagramm zeigt die Genehmigungen pro Land und Art im Verhältnis zur Gesamtanzahl an'
      }
    },
    error: 'Error. Please load the page again.'
  }
})

export default local
