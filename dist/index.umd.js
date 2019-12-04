if (process.env.NODE_ENV === 'production') {
    module.exports = require('./cookick.umd.production.js');
} else {
    module.exports = require('./cookick.umd.development.js');
}
