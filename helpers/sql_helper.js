function isNumber(n) { return !isNaN(parseFloat(n)) && !isNaN(n - 0) }


function escapeForSQL(input) {
    if(isNumber(input)) {
        return (input)
    }
    return '`'+input.replace('`', '\`')+'`';
}


function buildSQL(easy) {
    
    let sqlQuery = 'SELECT '
    let fromVal = '*';

    // console.log(typeof easy.columns)
    if(Array.isArray(easy.columns)) {

        let columnI = 0;
        for(let column of easy.columns) {
            easy.columns[columnI] = '`'+easy.columns[columnI]+'`';
            columnI++;
        }

        fromVal = easy.columns.join()
    }

    sqlQuery += fromVal+' FROM `'+easy.tableName+'` '

    if(easy.filter != null && easy.filter.length > 0) {
        sqlQuery += 'WHERE ';
        let i = 0;
        for(let whereItem of easy.filter) {

            if(i > 0) {
                sqlQuery += 'AND ';
            }

            sqlQuery += whereItem.column+' ';
            sqlQuery += whereItem.condition+' ';

            if(whereItem.condition.toLowerCase() == 'in') {
                let inValue = '(';

                let newInVals = []
                for(let inVal of whereItem.value) {
                    newInVals.push(escapeForSQL(inVal))
                }

                inValue += newInVals.join()

                inValue += ')';
                sqlQuery += inValue +' ';

            } else {
                sqlQuery += escapeForSQL(whereItem.value) +' ';
            }

            i++;
        }
    }


    // now the order by stuff
    if(easy.sorts != null && easy.sorts.length > 0) {
        sqlQuery += 'ORDER BY ';
        let iOfSort = 0;
        for(let sortItem of easy.sorts) {
            if(iOfSort > 0) {
                sqlQuery += ', ';
            }
            sqlQuery += sortItem.column+' '+sortItem.type + ''

            iOfSort++;
        }
        sqlQuery += ' '
    }

    return sqlQuery
    

}


module.exports = buildSQL