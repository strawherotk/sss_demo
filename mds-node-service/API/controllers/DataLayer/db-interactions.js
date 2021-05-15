
const hanaClient = require('@sap/hana-client');

const connection = hanaClient.createConnection();
const connectionParams = { // This should be configured in environment variables
  serverNode  : '71602fbb-03be-483c-9ea7-88430f8d1b93.hana.trial-eu10.hanacloud.ondemand.com:443',
  uid         : 'DBADMIN',
  pwd         : 'P@ssword1'
};

module.exports = {
  getAllRecords(table, columns) {
    const sql = `select ${columns && columns.length > 0 ? columns.join(',') : '*'} from ${table}`;
    return new Promise((resolve, reject) => {
      connection.connect(connectionParams, err => {
        if (err) reject(err);
        connection.exec(sql, (err, results) => {
          if (err) reject(err);
          connection.disconnect(err => {
            if(err) reject('Connection cannot be terminated');
          });
          resolve(results)
        });
      });
    });
  }
};