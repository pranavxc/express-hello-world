const express = require('express')
const axios = require('axios');
const path = require("path");
const app = express()

// #############################################################################
// Logs all request paths and method
app.use(function (req, res, next) {
  console.log(`req for ${req.originalUrl}`)
//   res.set('x-timestamp', Date.now())
//   res.set('x-powered-by', 'cyclic.sh')
//   let region = process.env.region
//   if (region && region === 'us-east-2'){
//       return res.status(500).json({'message':'error',region})
//   }
  next();
});

// #############################################################################
// This configures static hosting for files in /public that have the extensions
// listed in the array.
// var options = {
//   dotfiles: 'ignore',
//   etag: false,
//   extensions: ['htm', 'html','css','js','ico','jpg','jpeg','png','svg'],
//   index: ['index.html'],
//   maxAge: '1m',
//   redirect: false
// }
// app.use(express.static('public', options))

app.use('/curl', async (req,res) => {
  console.log(req)
  if (req.query.url) {
    try {
      let data = await axios.get(req.query.url).data
      res.json(data)
    } catch(error){
      res.json({"error":JSON.stringify(error)})
    }
  } else {
    res.json({"error":"missing url query parameter"})
  }
  res.end()
})

app.use('/error', async (req, res) => {
  throw new Error('Forcing an error')
})

app.use('/status/:code?', async (req, res) => {
  res.statusCode = req.params.code || 200
  res.send(`Sending status: ${res.statusCode}`)
  res.end()
})

app.use('/upload/:id?', async (req, res) => {
  res.statusCode = 307
  res.writeHead('307','Redirect Temporary', {
    'Location': `https://www.google.com/search?q=${req.params.id || 'rick roll'}`
  }).end()
})

app.get('/.well-known/acme-challenge/Of83JSoCssJj2DtyLKMEM9F9VGpt_rKcp6fUm7R0UmA', function(req, res, next) {
  res.send('Of83JSoCssJj2DtyLKMEM9F9VGpt_rKcp6fUm7R0UmA.inKFcraL59HWMXaKLVSNG1NPgp6ZBATgIr9FhGP8Oig');
});

// #############################################################################
// Log echo requests
app.use('/e/*', (req,res,next) => {
  var region = (process.env.region)? process.env.region : 'undefined'
  console.log(`[${region}] ${req.method} ${req.originalUrl}`);
  next()
})


// #############################################################################
// Catch all handler for all other request.
app.use('*', (req,res) => {
//   var region = (process.env.region)? process.env.region : 'undefined'
  res.json({
      message: 'msg: have a nice day',
//       region,
      path: req.originalUrl,
      at: new Date().toISOString(),
      params: req.params,
      env: process.env,
      headers: req.headers
    })
    .end()
})

module.exports = app
