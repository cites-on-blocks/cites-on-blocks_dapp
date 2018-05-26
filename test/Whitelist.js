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
  /*
   * Define some general test variables to use.
   */
  const ACC_OWNER = accounts[0] // The account address, who is owner of the contract.
  const ACC_NO_OWNER = accounts[1] // Another account used as counter to be not the owner of the contract.
  const ACC_NEW = accounts[2] // Address of the account to add to the whitelist.
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
      const whitelist = await Whitelist.deployed()
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

      // Check the country mapping, if the correct code has been mapped to the address.
      assert.equal(
        await whitelist.authorityMapping(COUNTRY, 0),
        ACC_NEW,
        'The address has not been added to the country!'
      )

      /* Check if the correct events have been thrown. */
      // Filter the relevant logs.
      const logs = result.logs.filter(
        entry => (entry.event = 'AddressWhitelisted')
      )

      // Make sure that at least one relevant event has been logged.
      assert.isAbove(logs.length, 0)

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
     * Try to add a single new address to the whitelist without beeing the owner of the contract.
     * Expect an exception to be thrown.
     */
    it('Can not add address if not beeing the owner.', async () => {
      // Add new address to the whitelist as non-owner
      let whitelist = await Whitelist.deployed()

      try {
        await whitelist.addAddress(ACC_NEW, COUNTRY, { from: ACC_NO_OWNER })
        assert.fail('Add address as non-owner should not been successful!')
      } catch (err) {
        // Expected to fail here.
      }
    })
  })
})
