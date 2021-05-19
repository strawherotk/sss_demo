/****************************
 * @author: Ly Dinh Van (ly.dinhvan@vn.bosch.com)
 * @version: 1.0.0
 * @description: Handle HanaDB interaction
 ****************************/

const hanaClient = require('@sap/hana-client');

const dbTables = require('./db-tables');

const connection = hanaClient.createConnection();
const connectionParams = { // This should be configured in environment variables
  serverNode: '71602fbb-03be-483c-9ea7-88430f8d1b93.hana.trial-eu10.hanacloud.ondemand.com:443',
  uid: 'DBADMIN',
  pwd: 'P@ssword1'
};

const execSQL = (sql) => {
  return new Promise((resolve, reject) => {
    connection.connect(connectionParams, err => {
      if (err) reject(err);
      connection.exec(sql, (err, results) => {
        if (err) reject(err);
        connection.disconnect(err => {
          if (err) reject('Connection cannot be terminated');
        });
        resolve(results)
      });
    });
  });
}

const buildCreateSQL = (table, data) => {
  const columnSet = [];
  const dataSet = [];
  Object.keys(data).map(val => {
    columnSet.push(dbTables.getColumn(table, val))
    const dataValue = data[val];
    dataSet.push(typeof (dataValue) === 'string' ? `\'${dataValue}\'` : dataValue);
  });
  return `INSERT INTO ${table} (${columnSet.join(', ')}) VALUES (${dataSet.join(', ')});`
}

module.exports = {
  getAllRecords: (res, table, columns) => {
    const sql = `select ${columns && columns.length > 0 ? columns.join(',') : '*'} from ${table}`;
    execSQL(sql).then(results => res.send(results), error => res.status(500).send({
      type: 'Error',
      message: `Error when get ${table}`,
      details: error
    }));
  },
  createRecords: (table, data, res) => {
    let sql = '';
    if (data instanceof Array) {
      sql = data.map(item => buildCreateSQL(table, item)).join();
    } else {
      sql = buildCreateSQL(table, data)
    }
    execSQL(sql).then(results => {
      res.status(201).send({ message: 'Created', count: results });
    }, error => {
      res.status(500).send({
        type: 'Error',
        message: `Error when insert record into ${table}`,
        details: error
      });
    });
  }
};