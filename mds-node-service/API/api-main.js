/****************************
 * @author: Ly Dinh Van (ly.dinhvan@vn.bosch.com)
 * @version: 1.0.0
 * @description: Hana Connector handler
 ****************************/

const dbHandler = require('./controllers/DataLayer/db-interactions');


module.exports = {
  getProducts: (req, res) => {
    dbHandler.getAllRecords(res, 'Products');
  },
  createProduct: (req, res, data) => {
    dbHandler.createRecords('Products', data, res);
  }
}