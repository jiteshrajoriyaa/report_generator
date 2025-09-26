const jp = require('jsonpath');
const _ = require('lodash');

function getValue(record, path) {
    try {
        if (!record || !path) return undefined;

        if (path.includes("[?(")) {
            const result = jp.query(record, "$." + path);
            return result.length > 0 ? result[0] : undefined;
        }

        return _.get(record, path);
    } catch (err) {
        console.error('JSONPath error for path:', path, err);
        return undefined;
    }
}

module.exports = getValue;