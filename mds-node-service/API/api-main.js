/****************************
 * @author: Ly Dinh Van (ly.dinhvan@vn.bosch.com)
 * @version: 1.0.0
 * @description: Hana Connector handler
 ****************************/

const dbHandler = require('./controllers/DataLayer/db-interactions');

module.exports = {
  getProducts(req, res) {
    dbHandler.getAllRecords('Products').then(results => res.send(results), error => res.status(500).send({
      type: 'Error',
      message: 'Error when get products',
      details: error 
    }));
  }
}