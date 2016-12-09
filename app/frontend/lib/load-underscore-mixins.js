import _ from "underscore"
_.mixin({
    mapValues: function (input, mapper) {
        return _.reduce(input, function (obj, v, k) {
            obj[k] = mapper(v, k, input);
            return obj;
        }, {});
    },
    removeAtIndex: function(input, index) {
        return [
            ...input.slice(0, index),
            ...input.slice(index + 1)
        ]
    }
});