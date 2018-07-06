export function trimHash(hash) {
  const substr1 = hash.substring(0, 7)
  const substr2 = hash.substring(hash.length - 5, hash.length)
  return `${substr1}...${substr2}`
}

export function toUnixTimestamp(date) {
  return date.getTime()
}

export function isASCII(string) {
  return /^[\x00-\x7F]*$/.test(string)
}
