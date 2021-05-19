/****************************
 * @author: Ly Dinh Van (ly.dinhvan@vn.bosch.com)
 * @version: 1.0.0
 * @description: Hana data base table model
 ****************************/

const DBMAPPING = {
  // [ 'FE Column', 'DB Column']
  Products: new Map([
    ['ID', 'ID'],
    ['NAME', 'NAME']
  ])
}
const getMapping = (name, column) => {
  if (!DBMAPPING[name]) throw `${name} table does not exist.`;
  const dbColumn = DBMAPPING[name].get(column);
  if (!dbColumn) throw `${column} does not exist in ${name}`;
  return dbColumn;
};

module.exports = {
  getColumn: (table, column) => {
    return getMapping(table, column);
  }
}