const https = require('https');
const sapAxios = require('sap-cf-axios').default;

module.exports = {
  getBusinessPartnerInfo: async (req, res) => {
    try {
      const axios = sapAxios('mdmbp-svc');
      axios({
        method: 'GET',
        url: '/BusinessPartner',
        params: {
          "$format": 'json'
        },
        headers: {
          'content-type': 'application/xml',
          'accept': 'application/json'
        }
      }).then((response => {
        res.send(response.data.d.results);
      }));
    } catch (error) {
      res.status(404).send(error);
    }
  }
}