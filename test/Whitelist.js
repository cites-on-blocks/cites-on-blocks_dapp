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

contract('Whitelist', async accounts => {
  const accOwner = accounts[0]
  const accNoOwner = accounts[1]
  const accNew = accounts[2]

  const country = string2Hex('DE')

  describe('#addAddress()', () => {
    it('The owner can add a new address.', async () => {
      // Add new address to the whitelist as owner.
      let whitelist = await Whitelist.deployed()
      await whitelist.addAddress(accNew, country, { from: accOwner })

      // Check if address has been added correctly into all maps.
      assert.isTrue(
        await whitelist.whitelist(accNew),
        'The address is not whitelisted!'
      )

      assert.equal(
        await whitelist.authorityToCountry(accNew),
        country,
        'The addresses country code is not correct!'
      )

      assert.equal(
        await whitelist.authorityMapping(country, 0),
        accNew,
        'The address has not been added to the country!'
      )
    })

    it('Can not add address if not beeing the owner.', async () => {
      // Add new address to the whitelist as non-owner
      let whitelist = await Whitelist.deployed()

      try {
        await whitelist.addAddress(accNew, country, { from: accNoOwner })
        assert.fail('Add address as non-owner should not been successful!')
      } catch (err) {
        // Expected to fail here.
      }
    })
  })
})
