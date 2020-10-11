# QueryTranslate Documentation
QueryTranslate is a small Javascript library that converts HTTP GET Query Paramters to an easy to handle Javascript object, SQL Query or KnexJS object.
<hr>

## Setup
**via npm:**
```
npm install query_translate --save
```
then define it:
```javascript
const QueryTranslate = require('query_translate'); // using require
import QueryTranslate from 'query_translate' // es6 import
```

**manually:**

place the library files somwhere in your project, than require it
```javascript
const QueryTranslate = require('path/to/query_translate'); // using require
import QueryTranslate from 'path/to/query_translate' // es6 import
```

You can then access it using *QueryTranslate.translate(...)*
<hr>

## Useage
The query format standards wil first be explained, then in the next section, parsing the query in Javascript will be explained.
### Query format
There are three types of parameters that are parsed by the library
* Filter (where condition)
* Sort condition
* columns (columns to return)

Parameter type | Schema | Example | Description
-- | --- | --- | ----
**Filter** |
equal to = | filter[column_name]=value | ?filter[country]=bh
not equal to <> | filter[column_name][not]=value | ?filter[country][not]=bh
greater than > | filter[column_name][gt]=value | ?filter[age][gt]=18
less than < | filter[column_name][lt]=value | ?filter[score][lt]=100
greater than or equal to <= | filter[column_name][lte]=value | ?filter[score][lte]=100
larger than or equal to >= | filter[column_name][lge]=value | ?filter[score][lge]=500
**In** |
where in | filter[column_name][in]=value1 | ?filter[lang][in]=ar&filter[lang][in]=en | equivelant to SQL: WHERE value IN (array), or if array contains
**Sort** |
sort by | sort[]=column,type(optional) | ?sort[]=id<br>?sort[]=id,desc<br>?sort[]=id,asc<br>?sort[]=id,desc&sort[]=score,asc | sort is an array, you can pass multiple sort parameters as in the last example
**Columns** |
columns to return | columns=column1,column2,column3 | ?columns=id,name,age,score | 
<br>

**Example queries**
```
?filter[age][gt]=18&filter[language][in]=english&filter[language][in]=arabic&sort[]=points,desc&sort[]=id,desc&columns=id,name,country,language,points
```
```
?filter[category]=comedy&filter[rating][lge]=4&sort[]=rating,desc
```
```
?filter[category]=comedy&filter[rating][lge]=4&sort[]=rating,desc&sort[]=id,asc&columns=id,name,rating,publish_date
```
```
?filter[category][in]=comedy&filter[category][in]=comic&filter[rating][lge]=4&sort[]=rating,desc&sort[]=id,asc&columns=id,name,rating,publish_date
```

## Parsing the query
**Example**
```javascript
let QueryTranslate = require('query_translate')

let translatedQuery = QueryTranslate.translate({
    format: 'sql', // format can be one of 'sql', 'knex' or 'easy'
    knex: knex, // if the format is set to knex, pass your knex variable here
    query: 'filter[age][gt]=18&filter[language][in]=english&filter[language][in]=arabic&sort[]=points,desc&sort[]=id,desc&columns=id,name,country,language,points', // raw url query, without ? at the beginning
    tableName: 'users' // table name,
});

console.log(JSON.stringify(translatedQuery))
```
**Available options**
Option | Value
-- | ---
format (required) | **sql:** returns raw SQL query<br>**knex:** returns a knex statement, when used, the knex variable must be passed to the knex option.<br>**easy:** returns the data as a Javascript object
knex<br>(required if format=knex) | The knex js variable, to be used to generate the statment
query | Raw url query, without ? at the beginning, refer to the example above for a sample value
tableName | The name of the table

### Sample outputs

**Input query**
```
filter[age][gt]=18&filter[language][in]=english&filter[language][in]=arabic&sort[]=points,desc&sort[]=id,desc&columns=id,name,country,language,points
```

**format: sql**
```
SELECT `id`,`name`,`country`,`language`,`points` FROM `users` WHERE age > 18 AND language IN (`english`,`arabic`) ORDER BY points DESC, id DESC
```

**format: easy**
```json
{"tableName":"users","filter":[{"column":"age","condition":">","value":"18"},{"column":"language","condition":"IN","value":["english","arabic"]}],"sorts":[{"column":"points","type":"DESC"},{"column":"id","type":"DESC"}],"columns":["id","name","country","language","points"]}
```

**format: knex**
<br>
returns a knex statement object