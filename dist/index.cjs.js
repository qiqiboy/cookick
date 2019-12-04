if (process.env.NODE_ENV === 'production') {
    module.exports = require('./cookick.cjs.production.js');
} else {
    module.exports = require('./cookick.cjs.development.js');
}
