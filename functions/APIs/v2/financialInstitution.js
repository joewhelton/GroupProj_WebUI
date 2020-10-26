const { rdb } = require('../../util/admin');

exports.getAllFinancialInstitutions = (request, response) => {
    const FIref = rdb.ref('/financialInstitutions');
    let results = {};

}