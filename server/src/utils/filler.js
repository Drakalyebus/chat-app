function fill(str, min = 3, max = 50, symbol = '*') {
    if (str.length > max) return str.slice(0, max);
    if (str.length < min) return str + Array(min - str.length).fill(symbol).join('');
    return str
}

export default fill;