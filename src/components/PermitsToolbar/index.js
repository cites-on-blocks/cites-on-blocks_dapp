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
      endDateFilter: '',
      eventsUpdated: props.eventsUpdated
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const {
      exCountryFilter,
      imCountryFilter,
      statusFilter,
      startDateFilter,
      endDateFilter
    } = this.state
    if (
      prevState.exCountryFilter !== exCountryFilter ||
      prevState.imCountryFilter !== imCountryFilter ||
      prevState.statusFilter !== statusFilter ||
      prevState.startDateFilter !== startDateFilter ||
      prevState.endDateFilter !== endDateFilter
    ) {
      this.props.onFilter(this.state)
    }
  }

  // applyFilters() {
  //   const { onSearchChange, onSelectChange, onDateChange } = this.props
  //   const {
  //     searchInput,
  //     exCountryFilter,
  //     imCountryFilter,
  //     statusFilter,
  //     startDateFilter,
  //     endDateFilter,
  //     eventsUpdated
  //   } = this.state
  //   if (eventsUpdated) {
  //     onSelectChange()
  //     onSearchChange()
  //   }
  // }

  render() {
    const { searchSuggestions } = this.props
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
          }}
          onDOMChange={e => {
            this.setState({ searchInput: e.target.value })
          }}
        />
        <Box direction={'row'} margin={{ vertical: 'medium' }}>
          <Box basis={'1/4'}>
            <FormField label={local.permits.countryOfExport}>
              <Select
                value={exCountryFilter}
                options={COUNTRY_FILTER_OPTS}
                onChange={({ option }) =>
                  this.setState({ exCountryFilter: option })
                }
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
  onFilter: PropTypes.func,
  eventsUpdated: PropTypes.bool
}

export default PermitsToolbar
