const express = require('express')
const path = require("path");
const app = express()

// #############################################################################
// Logs all request paths and method
app.use(function (req, res, next) {
  res.set('x-timestamp', Date.now())
  res.set('x-powered-by', 'cyclic.sh')
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  let region = process.env.region
  if (region && region === 'us-west-2'){
      return res.status(500).json({'message':'error',region})
  }
  next();
});

// #############################################################################
// This configures static hosting for files in /public that have the extensions
// listed in the array.
var options = {
  dotfiles: 'ignore',
  etag: false,
  extensions: ['htm', 'html','css','js','ico','jpg','jpeg','png','svg'],
  index: ['index.html'],
  maxAge: '1m',
  redirect: false
}
app.use(express.static('public', options))


// #############################################################################
// Catch all handler for all other request.
app.use('*', (req,res) => {
  var region = (process.env.region)? process.env.region : 'undefined'
  console.error(region)
  res.json({
      message: 'Multi-regional',
      region,
      at: new Date().toISOString(),
      params: req.params,
      env: process.env
    })
    .end()
})

module.exports = app
