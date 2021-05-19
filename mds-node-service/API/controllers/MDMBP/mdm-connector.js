const https = require('https');
const sapAxios = require('sap-cf-axios').default;

const axios = sapAxios('mdmbp-svc', null, { method: 'get' });

module.exports = {
  getBusinessPartnerInfo: async (req, res) => {
    try {
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
        res.send(response.data);
      }));
    } catch (error) {
      res.status(404).send(error);
    }
  },
  createOrganization: async(req, res) => {
    try {
      axios({
        method: 'POST',
        url: '/BusinessPartner',
        headers: {
          'content-type': 'application/json',
          'accept': 'application/json'
        },
        xsrfHeaderName: "x-csrf-token",
        data: req.body,
      }).then((response => {
        res.status(201).send(response.data);
      }));
    } catch (error) {
      res.status(404).send(error);
    }
  }
}