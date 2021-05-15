/****************************
 * @author: Ly Dinh Van (ly.dinhvan@vn.bosch.com)
 * @version: 1.0.0
 * @description: Run file for application
 ****************************/

const port = process.env.PORT || 6969;

const express = require('express');
const passport = require('passport');
const xsenv = require('@sap/xsenv');
const JWTStrategy = require('@sap/xssec').JWTStrategy;
const jwtDecode = require('jwt-decode');
const bodyParser = require('body-parser');

const api = require('./API/api-main');
const mdsAPI = require('./API/controllers/MDMBP/mdm-connector');

const app = express();
app.use(bodyParser.json()); // Parse body data for PUT/POST request
app.use(bodyParser.urlencoded({ extended: false }));

// XSUAA Middleware
const service = xsenv.getServices({
  uaa: {
    name: 'mds_ui5_xsuaa' // Name of XSUAA service
  }
}).uaa;
passport.use(new JWTStrategy(service));
app.use(passport.initialize());
app.use(passport.authenticate('JWT', { session: false }));

app.get('/productData', (req, res, next) => {
  api.getProducts(req, res);
});

app.post('/product', (req, res, next) => {
  res.send('Hihi');
});

app.get('/user', (req, res, next) => {
  const userInfo = req.user;
  res.send(userInfo);
});

app.get('/mds/logout', (req, res) => {
  req.logout();
  res.redirect('/mdsui5');
});

app.get('/', (req, res) => {
  res.redirect('/mdsui5');
});

app.get('/user-info', (req, res, next) => {
  const authInfo = req.headers.authorization;
  const token = authInfo.split(' ').pop();
  const decodedData = jwtDecode(token);
  const returnedData = { ...decodedData };
  res.send(returnedData);
});

app.get('/business-partner-info', (req, res, next) => {
  mdsAPI.getBusinessPartnerInfo(req, res).then(() => console.log('req done'));
});

app.listen(port, () => {
  console.info(`App listening in port: ${port}`);
});