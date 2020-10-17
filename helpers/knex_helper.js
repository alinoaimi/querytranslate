function buildKnex(easy) {
    let knex = null;
    try {
        knex = require('knex')
    } catch(e) {

    }
    
    if(knex == null) {
        return 'knex is not installed'
    }

    let stmnt = easy.knex(easy.tableName)

    // filter
    if(easy.filter != null && easy.filter.length > 0) {

        for(let whereItem of easy.filter) {


            if(whereItem.condition.toLowerCase() == 'in') {
                stmnt = stmnt.whereIn(whereItem.column, whereItem.value)

            } else {

                if(whereItem.value == '{null}') {
                    if(whereItem.condition == '=') {
                        stmtn = stmnt.whereNull(whereItem.column)
                    } else if(whereItem.condition == '<>') {
                        stmtn = stmnt.whereNotNull(whereItem.column)
                    }
                } else {
                    stmtn = stmnt.where(whereItem.column, whereItem.condition, whereItem.value)
                }
            }

        }
    }


    // now the order by stuff
    if(easy.sorts != null && easy.sorts.length > 0) {

        for(let sortItem of easy.sorts) {
            stmnt = stmnt.orderBy(sortItem.column, sortItem.type)
        }

    }


    return stmnt
    
}

module.exports = buildKnex