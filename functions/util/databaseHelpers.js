const getData = (ref) => {
    return new Promise((resolve, reject) => {
        const onError = error => reject(error);
        const onData = snapshot => resolve(snapshot);

        ref.on("value", onData, onError);
    });
};

module.exports = { getData };