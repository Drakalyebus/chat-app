function desame(arr, getter = item => item, replacer = () => null) {
    let last = null;
    return arr.map((item, i, arr) => {
        const getterResult = getter(item, i, arr);
        if (getterResult === last) {
            return replacer(item, i, arr);
        }
        last = getterResult;
        return item;
    });
}

export default desame;