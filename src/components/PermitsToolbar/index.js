import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Box, Search, Select, FormField, DateTime } from 'grommet'

import { COUNTRY_FILTER_OPTS, STATUS_FILTER_OPTS } from '../../util/options'
import local from '../../localization/localizedStrings'

/**
 * Component for toolbar in Permits List.
 */
class PermitsToolbar extends Component {
  constructor(props) {
    super(props)
    this.state = {
      searchInput: '',
      exCountryFilter: COUNTRY_FILTER_OPTS[0],
      imCountryFilter: COUNTRY_FILTER_OPTS[0],
      statusFilter: STATUS_FILTER_OPTS[0],
      startDateFilter: '',
      endDateFilter: ''
    }
  }

  render() {
    const {
      searchSuggestions,
      onSearchChange,
      onSelectChange,
      onDateChange
    } = this.props
    const {
      searchInput,
      exCountryFilter,
      imCountryFilter,
      statusFilter,
      startDateFilter,
      endDateFilter
    } = this.state
    return (
      <Box margin={'medium'}>
        <Search
          placeHolder={local.permits.searchPlaceholder}
          inline={true}
          responsive={false}
          suggestions={searchSuggestions}
          value={searchInput}
          onSelect={({ suggestion }) => {
            this.setState({ searchInput: suggestion })
            onSearchChange(suggestion)
          }}
          onDOMChange={e => {
            this.setState({ searchInput: e.target.value })
            onSearchChange(e.target.value)
          }}
        />
        <Box direction={'row'} margin={{ vertical: 'medium' }}>
          <Box basis={'1/4'}>
            <FormField label={local.permits.countryOfExport}>
              <Select
                value={exCountryFilter}
                options={COUNTRY_FILTER_OPTS}
                onChange={({ option }) => {
                  this.setState({ exCountryFilter: option })
                  onSelectChange('exportCountry', option.value)
                }}
              />
            </FormField>
          </Box>
          <Box basis={'1/4'}>
            <FormField label={local.permits.countryOfImport}>
              <Select
                value={imCountryFilter}
                options={COUNTRY_FILTER_OPTS}
                onChange={({ option }) => {
                  this.setState({ imCountryFilter: option })
                  onSelectChange('importCountry', option.value)
                }}
              />
            </FormField>
          </Box>
          <Box basis={'1/4'}>
            <FormField label={local.permits.status}>
              <Select
                value={statusFilter}
                options={STATUS_FILTER_OPTS}
                onChange={({ option }) => {
                  this.setState({ statusFilter: option })
                  onSelectChange('status', option.value)
                }}
              />
            </FormField>
          </Box>
          <Box basis={'1/4'}>
            <FormField label={local.permits.from}>
              <DateTime
                id={'startTime'}
                name={'startTime'}
                format={'D/M/YYYY'}
                value={startDateFilter}
                onChange={startDate => {
                  this.setState({ startDateFilter: startDate })
                  onDateChange(startDate, endDateFilter)
                }}
              />
            </FormField>
          </Box>
          <Box basis={'1/4'}>
            <FormField label={local.permits.to}>
              <DateTime
                id={'endTime'}
                name={'endTime'}
                format={'D/M/YYYY'}
                value={endDateFilter}
                onChange={endDate => {
                  this.setState({ endDateFilter: endDate })
                  onDateChange(startDateFilter, endDate)
                }}
              />
            </FormField>
          </Box>
        </Box>
      </Box>
    )
  }
}

PermitsToolbar.propTypes = {
  searchInput: PropTypes.any,
  searchSuggestions: PropTypes.array,
  onSearchChange: PropTypes.func,
  onSearchSelect: PropTypes.func,
  onSelectChange: PropTypes.func,
  onDateChange: PropTypes.func
}

export default PermitsToolbar
