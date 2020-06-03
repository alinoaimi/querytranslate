var qs = require('qs');
let buildSQL = require('./helpers/sql_helper')
let buildKnex = require('./helpers/knex_helper')

exports.translate = function (params) {

    // let params = {
    //     format: 'sql',
    //     query: '',
    //     tableName: 'users',
    //     allowedColumns: ['id','email','etc...']
    // }

    // params.format = 'sql', 'knex' or 'pretty'

    toReturn = {};

    let parsedQuery = qs.parse(params.query);



    // let sql_query = 'SELECT {fields} FROM '+params.tableName;
    let wheres = [];
    let sorts = [];
    let columns = '*';
    for (let key of Object.keys(parsedQuery)) {
        let val = parsedQuery[key]

        if (key == 'filter') { // FILTER
            for (let filterKey of Object.keys(val)) {

                let filterVal = val[filterKey]

                if (typeof filterVal == 'string') {
                    // EQUAL TO
                    wheres.push({
                        'column': filterKey,
                        'condition': '=',
                        'value': filterVal
                    })
                } else {
                    for (let filterSubKey of Object.keys(filterVal)) {
                        const filterSubVal = filterVal[filterSubKey]

                        if (filterSubKey == 'gt') { // [gt] GREATER THAN
                            wheres.push({
                                'column': filterKey,
                                'condition': '>',
                                'value': filterSubVal
                            })
                        } else if (filterSubKey == 'lt') { // [lt] LESS THAN
                            wheres.push({
                                'column': filterKey,
                                'condition': '<',
                                'value': filterSubVal
                            })
                        } else if (filterSubKey == 'gte') { // [lt] GREATER THAN OR EQUAL TO
                            wheres.push({
                                'column': filterKey,
                                'condition': '>=',
                                'value': filterSubVal
                            })
                        } else if (filterSubKey == 'lte') { // [lt] LESS THAN OR EQUAL TO
                            wheres.push({
                                'column': filterKey,
                                'condition': '<=',
                                'value': filterSubVal
                            })
                        } else if (filterSubKey == 'in') { // [in] IN
                            wheres.push({
                                'column': filterKey,
                                'condition': 'IN',
                                'value': filterSubVal
                            })
                        }
                    }
                }

            }
        } else if (key == 'sort') { // SORT
            for (let sortItem of val) {
                let sortItemSplitted = sortItem.split(',');
                let sortType = 'DESC';

                if (sortItemSplitted.length > 1) {
                    if (sortItemSplitted[1].toLowerCase() == 'asc') {
                        sortType = 'ASC';
                    }
                }

                sorts.push({
                    'column': sortItemSplitted[0],
                    'type': sortType
                });

            }
        } else if (key == 'columns') { // COLUMNS
            columns = val.split(',')
        }
    }

    let easy = {
        tableName: params.tableName,
        filter: wheres,
        sorts: sorts,
        columns: columns
    }

    switch (params.format.toLowerCase()) {
        case 'easy':
            return easy
        case 'sql':
            return buildSQL(easy)
        case 'knex':
            easy['knex'] = params.knex
            return buildKnex(easy)
    }


    return false;


}

