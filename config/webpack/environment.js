const { environment } = require('@rails/webpacker')
const typescript =  require('./loaders/typescript')

environment.config.set("performance.maxEntryPointSize", 512000)
environment.config.set("performance.maxAssetSize", 512000)

environment.loaders.prepend('typescript', typescript)
module.exports = environment
