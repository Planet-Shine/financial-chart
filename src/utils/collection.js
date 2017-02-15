
var $collection = {
    equal(collection1, collection2) {
        if (Object.keys(collection1).length !== Object.keys(collection2).length) {
            return false
        }
        return Object.keys(collection1).every(key => collection1[key] === collection2[key]);
    }
};

export default $collection;