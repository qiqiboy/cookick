if (process.env.NODE_ENV === 'production') {
    module.exports = require('./cookick.esm.production.js');
} else {
    module.exports = require('./cookick.esm.development.js');
}
