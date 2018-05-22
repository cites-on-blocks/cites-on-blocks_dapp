import LocalizedStrings from 'react-localization'

let s = new LocalizedStrings({

  en: {
    whitelist: 'Whitelist',
    permits: 'Permits',
    analytics: 'Analytics',
    importExport: 'Import/Export',
    help: 'Help',
    openingDays: 'Monday to Saturday',
    openingHours: '7 am - 9 pm E.T.',
    contactPhone: '(1-⁠844-⁠627-⁠2871)',
    officeName: 'Cites Office:'
  },
  de: {
    whitelist: 'Whitelist',
    permits: 'Genehmigungen',
    analytics: 'Analyse',
    importExport: 'Import/Export',
    help: 'Hilfe',
    openingDays: 'Montag bis Samstag',
    openingHours: '7 - 21 Uhr E.T.',
    contactPhone: '(1-⁠844-⁠627-⁠2871)',
    officeName: 'Cites Büro:'
  }
});

export default s