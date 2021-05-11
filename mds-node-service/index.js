/****************************
 * @author: Ly Dinh Van (ly.dinhvan@vn.bosch.com)
 * @version: 1.0.0
 * @description: Run file for application
 ****************************/

const port = (process.env.PORT || 3000);

const express = require('express');
const passport = require('passport');
const xsenv = require('@sap/xsenv');
const JWTStrategy = require('@sap/xssec').JWTStrategy;
const jwtDecode = require('jwt-decode');
const bodyParser = require('body-parser');

const app = express();

// XSUAA Middleware
const service = xsenv.getServices({
  uaa: {
    name: 'mds_ui5_xsuaa' //Name of XSUAA service
  }
}).uaa;
passport.use(new JWTStrategy(service));
app.use(passport.initialize());
app.use(passport.authenticate('JWT', { session: false }));

app.use(bodyParser.json()); // Parse body data for PUT/POST request

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

app.listen(port, () => {
  console.info(`App listening in port: ${port}`);
});