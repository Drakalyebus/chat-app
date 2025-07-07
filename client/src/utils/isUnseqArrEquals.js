function isUnseqArrEquals(arr1, arr2) {
    if (arr1.length !== arr2.length) return false;
    return arr1.every((el) => arr2.includes(el));
}

export default isUnseqArrEquals;