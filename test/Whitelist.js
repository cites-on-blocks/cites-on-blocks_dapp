const Whitelist = artifacts.require('./Whitelist.sol')

/**
 * Convert a string into its equivalent hexadecimal string.
 * @dev Used for country codes.
 * @param string - the string to convert
 * @return hex - the converted hexadecimal string
 */
const string2Hex = function(string) {
  let hex = '0x'

  for (let i = 0; i < string.length; i++) {
    hex += '' + string.charCodeAt(i).toString(16)
  }

  return hex
}

/**
 * Tests for whitelist contract.
 */
contract('Whitelist', async accounts => {
  /**
   * Get a new contract deployment for each test case to be clean and run independently.
   */
  beforeEach(async () => {
    whitelist = await Whitelist.new()
  })

  /*
   * Define some general test variables to use.
   */
  const ACC_OWNER = accounts[0] // The account address, who is owner of the contract.
  const ACC_NO_OWNER = accounts[1] // Another account used as counter to be not the owner of the contract.
  const ACC_NEW = accounts[2] // Address of the account to add to the whitelist.
  const ACC_NEW_LIST = accounts.slice(2, 4) // A list of addresses to add to the whitelist.
  const COUNTRY = string2Hex('DE') // Example country code converted to hexadecimal bytecode.

  /*
   * Tests for the addAddress function.
   */
  describe('#addAddress()', () => {
    /**
     * Add a single new address to the whitelist as the owner of the contract.
     * Check if the call was successful and all mappings have been extended correctly.
     */
    it('The owner can add a new address.', async () => {
      // Add new address to the whitelist as owner.
      const result = await whitelist.addAddress(ACC_NEW, COUNTRY, {
        from: ACC_OWNER
      })

      /* Check if address has been added correctly into all maps. */
      // Check the whitelist mapping entry if the address is set to true.
      assert.isTrue(
        await whitelist.whitelist(ACC_NEW),
        'The address is not whitelisted!'
      )

      // Check in the authority to country mapping list, if is contains the new address.
      assert.equal(
        await whitelist.authorityToCountry(ACC_NEW),
        COUNTRY,
        'The addresses country code is not correct!'
      )

      // Check the authority mapping if the address has been added to the list.
      assert.equal(
        await whitelist.authorityMapping(COUNTRY, 0),
        ACC_NEW,
        'The address has not been added to the country!'
      )

      /* Check if the correct events have been thrown. */
      // Filter the relevant logs.
      const logs = result.logs.filter(
        entry => entry.event === 'AddressWhitelisted'
      )

      // Make sure the correct number of events have been thrown.
      assert.equal(logs.length, 1)

      // Take the first log entry as the one to check further (only one is expected).
      const log = logs[0]

      // Check if the address in the event is the provided one.
      assert.equal(
        log.args.added,
        ACC_NEW,
        'The defined address in the thrown event should be the provided one.'
      )

      // Check if the country code in the event is the provided one.
      assert.equal(
        log.args.country,
        COUNTRY,
        'The defined country code in the thrown event should e the provided one.'
      )
    })

    /**
     * Add the same address with the same country code two times.
     * This should enable the address (again), but leave the country mappings untouched.
     */
    it('Add an address twice with the same country code only (re)enable the address.', async () => {
      // Add the address the first time.
      await whitelist.addAddress(ACC_NEW, COUNTRY, { from: ACC_OWNER })

      // Store the current mapping values.
      const authorityToCountryValue = await whitelist.authorityToCountry(
        ACC_NEW
      )

      const authorityMappingValue = await whitelist.authorityMapping(COUNTRY, 0)

      // Add the address a second time with the same country code.
      await whitelist.addAddress(ACC_NEW, COUNTRY, { from: ACC_OWNER })

      /* Check the resulting mapping values. */
      // Check if the address is still enabled.
      assert.isTrue(
        await whitelist.whitelist(ACC_NEW),
        'The address should stay enabled when add it again!'
      )

      // Check if the authority to country mapping hasn't changed.
      assert.equal(
        await whitelist.authorityToCountry(ACC_NEW),
        authorityToCountryValue,
        'The authority to country mapping should not change on adding the address twice!'
      )

      // Check if the authority mapping hasn't changed.
      assert.equal(
        await whitelist.authorityMapping(COUNTRY, 0),
        authorityMappingValue,
        'The authority mapping should not change on adding the address twice!'
      )
    })

    /**
     * Try to add a single new address to the whitelist without beeing the owner of the contract.
     * Expect an exception to be thrown.
     */
    it('Can not add address if not beeing the owner.', async () => {
      // Add new address to the whitelist as non-owner
      try {
        await whitelist.addAddress(ACC_NEW, COUNTRY, { from: ACC_NO_OWNER })
        assert(false, 'Add address as non-owner should not been successful!')
      } catch (err) {
        // Expected to fail here.
      }
    })

    /**
     * Try to add the same address twice with different country codes.
     * Expect an exception to be thrown.
     */
    it('Can not add the same address twice with different country codes.', async () => {
      // Add the address the first time.
      await whitelist.addAddress(ACC_NEW, COUNTRY, { from: ACC_OWNER })

      // Try to add the same address a second time with a different country code.
      try {
        await whitelist.addAddress(ACC_NEW, string2Hex('EN'), {
          from: ACC_OWNER
        })

        assert(
          false,
          'Add the same address twice with different country codes should not been successful!'
        )
      } catch (err) {
        // Expected to fail here.
      }
    })
  })

  /*
   * Tests for the addAddresses function.
   */
  describe('#addAddresses()', () => {
    /**
     * Add a list of new addresses to the whitelist as the owner of the contract.
     * Check if the call was successful and all mappings have been extended correctly.
     */
    it('The owner can add a list of new addresses.', async () => {
      // Add a list of new addresses to the whitelist as owner.
      const result = await whitelist.addAddresses(ACC_NEW_LIST, COUNTRY, {
        from: ACC_OWNER
      })

      /* Check if all addresses in the list have been added correctly into all maps. */
      for (let i = 0; i < ACC_NEW_LIST.length; i++) {
        // Check the whitelist mapping entry if the address are set to true.
        assert.isTrue(
          await whitelist.whitelist(ACC_NEW_LIST[i]),
          'An address in the list is not whitelisted!'
        )

        // Check in the authority to country mapping list, if is contains the new addresses.
        assert.equal(
          await whitelist.authorityToCountry(ACC_NEW_LIST[i]),
          COUNTRY,
          'The country code for an address in the list is not correct!'
        )

        // Check the authority mapping if the address has been added to the list.
        assert.equal(
          await whitelist.authorityMapping(COUNTRY, i),
          ACC_NEW_LIST[i],
          'An address in the list has not been added to the country!'
        )
      }

      /* Check if the correct events have been thrown for all addresses in the list. */
      // Filter the relevant logs.
      const logs = result.logs.filter(
        entry => entry.event === 'AddressWhitelisted'
      )

      // Make sure the correct number of events have been thrown.
      assert.equal(logs.length, ACC_NEW_LIST.length)

      for (let i = 0; i < ACC_NEW_LIST.length; i++) {
        // Check if the address in the current event is the provided one.
        assert.equal(
          logs[i].args.added,
          ACC_NEW_LIST[i],
          'An defined address in the list is not equal to the one in the thrown event.'
        )

        // Check if the country code in the event is the provided one.
        assert.equal(
          logs[i].args.country,
          COUNTRY,
          'The country code for one address in the list is not equal the one in the thrown event.'
        )
      }
    })

    /**
     * Try to add an empty list of addresses to the whitelist.
     * Expect an exception to be thrown.
     */
    it('Can not add an empty list of addresses.', async () => {
      // Add an empty list to the whitelist.
      try {
        await whitelist.addAddresses([], COUNTRY, { from: ACC_NO_OWNER })

        assert(
          false,
          'Add an empty list of addresses should not been successful!'
        )
      } catch (err) {
        // Expected to fail here.
      }
    })

    /**
     * Try to add a list of new addresses to the whitelist without beeing the owner of the contract.
     * Expect an exception to be thrown.
     */
    it('Can not add a list of addresses if not beeing the owner.', async () => {
      // Add new address to the whitelist as non-owner
      try {
        await whitelist.addAddresses(ACC_NEW_LIST, COUNTRY, {
          from: ACC_NO_OWNER
        })

        assert(false, 'Add addresses as non-owner should not been successful!')
      } catch (err) {
        // Expected to fail here.
      }
    })
  })

  /*
   * Tests for the removeAddress function.
   */
  describe('#removeAddress()', () => {
    /**
     * Add a new address that can be removed before each test case.
     */
    beforeEach(async () => {
      await whitelist.addAddress(ACC_NEW, COUNTRY, { from: ACC_OWNER })
    })

    /**
     * Remove a single address from the whitelist as the owner of the contract.
     * Check if the address has been disabled correctly.
     * As assumption the address has to exist in the whitelist.
     */
    it('The owner can remove an address.', async () => {
      // Remove an existing address.
      const result = await whitelist.removeAddress(ACC_NEW, {
        from: ACC_OWNER
      })

      /* Check if address has been removed correctly. */
      // Check if the address is disabled.
      assert.isFalse(
        await whitelist.whitelist(ACC_NEW),
        'The address should be disabled after remove it!'
      )

      // Filter the relevant logs.
      const logs = result.logs.filter(entry => entry.event === 'AddressRemoved')

      // Make sure the correct number of events have been thrown.
      assert.equal(
        logs.length,
        1,
        'The number of thrown events does not correlate with the number of removed addresses!'
      )

      // Take the first log entry as the one to check further (only one is expected).
      const log = logs[0]

      // Check if the address in the event is the one provided on removing the address.
      assert.equal(
        log.args.removed,
        ACC_NEW,
        'The defined address in the thrown event should be the provided one!'
      )

      // Check if the address in the event is the one provided on adding the address.
      assert.equal(
        log.args.country,
        COUNTRY,
        'The defined country code in the thrown event should be the provided one!'
      )
    })

    /**
     * Try to remove a single address from the whitelist without being the owner of the contract.
     * As assumption the address have to exist in the whitelist.
     * Expect an exception to be thrown.
     */
    it('Can not remove an address if not being the owner.', async () => {
      // Try to remove an address as non-owner.
      try {
        await whitelist.removeAddress(ACC_NEW, { from: ACC_NO_OWNER })

        assert(
          false,
          'Remove an address as non-owner should not been successful!'
        )
      } catch (err) {
        // Expected to fail here.
      }
    })
  })

  /*
   * Tests for the removeAddresses function.
   */
  describe('#removeAddresses()', () => {
    /**
     * Add a list of new addresses that can be removed before each test case.
     */
    beforeEach(async () => {
      await whitelist.addAddresses(ACC_NEW_LIST, COUNTRY, { from: ACC_OWNER })
    })

    /**
     * Remove a list of addresses from the whitelist as the owner of the contract.
     * Check if all addresses in the list have been disabled correctly.
     * As assumption the addresses have to exist in the whitelist.
     */
    it('The owner can remove a list of addresses.', async () => {
      // Remove a list of existing addresses.
      const result = await whitelist.removeAddresses(ACC_NEW_LIST, {
        from: ACC_OWNER
      })

      /* Check if all addresses in the list have been removed correctly. */
      for (let i = 0; i < ACC_NEW_LIST.length; i++) {
        assert.isFalse(
          await whitelist.whitelist(ACC_NEW_LIST[i]),
          'An address in the list is not disabled!'
        )
      }

      /* Check if the correct events have been thrown for all addresses in the list. */
      // Filter the relevant logs.
      const logs = result.logs.filter(entry => entry.event === 'AddressRemoved')

      // Make sure the correct number of events have been thrown.
      assert.equal(
        logs.length,
        ACC_NEW_LIST.length,
        'The number of thrown events does not correlate with the number of removed addresses!'
      )

      for (let i = 0; i < ACC_NEW_LIST.length; i++) {
        // Check if the address in the current event is the one provided on removing the address.
        assert.equal(
          logs[i].args.removed,
          ACC_NEW_LIST[i],
          'An defined address in the list is not equal to the one in the thrown event!'
        )

        // Check if the address in the current event is the one provided on adding the address.
        assert.equal(
          logs[i].args.country,
          COUNTRY,
          'The country code for one address in the list is not equal the one in the thrown event!'
        )
      }
    })

    /**
     * Try to remove a list of addresses from the whitelist without being the owner of the contract.
     * As assumption all addresses in the list have to exist in the whitelist.
     * Expect an exception to be thrown.
     */
    it('Can not remove a list of addresses if not being the owner.', async () => {
      // Try to remove a list of addresses as non-owner.
      try {
        await whitelist.removeAddress(ACC_NEW_LIST, { from: ACC_NO_OWNER })

        assert(
          false,
          'Remove a list of addresses as non-owner should not been successful!'
        )
      } catch (err) {
        // Expected to fail here.
      }
    })
  })

  /*
   * Tests for the removeCountry function.
   */
  describe('#removeCountry()', () => {
    /**
     * Add a list of new addresses for a single country that can be removed before each test case.
     */
    beforeEach(async () => {
      await whitelist.addAddresses(ACC_NEW_LIST, COUNTRY, { from: ACC_OWNER })
    })

    /**
     * Remove a country from the whitelist as the owner of the contract.
     * Check if all addresses for the country have been disabled correctly.
     * As assumption the country has to exist in the whitelist.
     */
    it('The owner can remove a country.', async () => {
      // Remove all addresses for a country.
      const result = await whitelist.removeCountry(COUNTRY, {
        from: ACC_OWNER
      })

      /* Check if all addresses for the country have been removed correctly. */
      for (let i = 0; i < ACC_NEW_LIST.length; i++) {
        assert.isFalse(
          await whitelist.whitelist(ACC_NEW_LIST[i]),
          'An address for the country is not disabled!'
        )
      }

      /* Check if the correct events have been thrown for all addresses for the country. */
      // Filter the relevant logs.
      const logs = result.logs.filter(entry => entry.event === 'AddressRemoved')

      // Make sure the correct number of events have been thrown.
      assert.equal(
        logs.length,
        ACC_NEW_LIST.length,
        'The number of thrown events does not correlate with the number of removed addresses!'
      )

      for (let i = 0; i < ACC_NEW_LIST.length; i++) {
        // Check if the address in the current event is the one provided on removing the address.
        assert.equal(
          logs[i].args.removed,
          ACC_NEW_LIST[i],
          'An defined address in the list is not equal to the one in the thrown event!'
        )

        // Check if the address in the current event is the one provided on adding the address.
        assert.equal(
          logs[i].args.country,
          COUNTRY,
          'The country code for one address in the list is not equal the one in the thrown event!'
        )
      }

      /* Check if the final event for the removed country has been thrown. */
      // Filter the relevant log.
      const log = result.logs.filter(
        entry => entry.event === 'CountryRemovedFromWhitelist'
      )

      // Make sure one such event has been thrown.
      assert.equal(
        log.length,
        1,
        'The event that the whole country has been removed has not been thrown!'
      )
    })

    /**
     * Try to remove a country from the whitelist without being the owner of the contract.
     * As assumption the country has to exist in the whitelist.
     * Expect an exception to be thrown.
     */
    it('Can not remove a country if not being the owner.', async () => {
      // Try to remove a country as non-owner.
      try {
        await whitelist.removeCountry(COUNTRY, { from: ACC_NO_OWNER })

        assert(
          false,
          'Remove a country as non-owner should not been successful!'
        )
      } catch (err) {
        // Expected to fail here.
      }
    })
  })
})
