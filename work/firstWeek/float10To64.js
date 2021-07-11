
function float10To64(v) {
  if (typeof v !== 'number' || v === Infinity || v === -Infinity || Number.isNaN(v)) {
    return
  }
  v = v + ''
  const base64 = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-+'.split('')
  const values = v.split('.')
  let integerNum = values[0]
  let decimalNum = values[1]
  let resultInteger = []
  let resultDecimal = []
  if (integerNum.length > 16 || decimalNum.length > 16) {
    alert('超过有效长度')
    return
  }
  // 整数部分
  while (integerNum > 63) {
    resultInteger.unshift(base64[integerNum % 64]) // push余数 
    integerNum = Math.floor(integerNum / 64) // 改成整除部分
  }
  resultInteger.unshift(base64[integerNum])
  // 小数部分
  let result
  do {
    decimalNum = ('0.' + decimalNum) 
    const transitValues = ((decimalNum * 64) + '').split('.')
    resultDecimal.push(base64[transitValues[0]])
    result = transitValues[1]
    decimalNum = transitValues[1]
  } while(result && resultDecimal.length < 16)
  return resultInteger.join('') + '.' + resultDecimal.join('')
}
console.log(float10To64(100.112112))