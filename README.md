![npm](https://img.shields.io/npm/v/query_translate)

## QueryTranslate
QueryTranslate is a small Javascript library that converts HTTP GET Query Paramters to an easy to handle Javascript object, SQL Query or KnexJS object to simplify returning lists via GET requests in REST APIs with complex filters.

Supported output formats: SQL Query, KnexJS Object, Javascript Object (check the documentation)

### Motives
I was working on a REST API, while strictly following Google's API Design guidelines, according to it, and most other guidelines, GET requests should be used to list items, without passing a body, therefore, the only way to pass filters and options is via the URL, as query parameters. Describing, parsing and handling complex options via query params could be a long process, and result in a long code, to simplify the process, I created this library, and defined a standard way to pass the options via query params.

## Links
* [**Documentation**](https://github.com/alinoaimi/querytranslate/blob/master/documentation.md)
* [NPM](https://www.npmjs.com/package/query_translate)
## Quick Example
Let's say you are building a rest API, using GET method to return a collection list

GET https://example.com/api/v1/users

You do not want to pass the filters and options in the body, because most API design guidelines recommend against that, so the only option left is passing them in the URL as query parameters, that's easy if you have very few pre-defined conditions, however, if you would like to enable complex filtering and sorting options, it could quickly get messy.

QueryTranslate defines a schema to pass the options, then converts it to the specified format (Javascript Object, SQL Query or KnexJS Object)

### Example
GET https://example.com/api/v1/users?filter[age][gt]=18&filter[language][in]=english&filter[language][in]=arabic&sort[]=points,desc&sort[]=id,desc&columns=id,name,country,language,points

will be converted to

Translate to SQL
```Javascript
let translatedQuery = QueryTranslate.translate({
    format: 'sql',
    query: 'filter[age][gt]=18&filter[language][in]=english&filter[language][in]=arabic&sort[]=points,desc&sort[]=id,desc&columns=id,name,country,language,points',
    tableName: 'users'
});
```
SQL Output:
```sql
SELECT `id`,`name`,`country`,`language`,`points` FROM `users` WHERE age > 18 AND language IN (`english`,`arabic`) ORDER BY points DESC, id DESC
```
Translate to Easy Object
```Javascript
let translatedQuery = QueryTranslate.translate({
    format: 'easy',
    query: 'filter[age][gt]=18&filter[language][in]=english&filter[language][in]=arabic&sort[]=points,desc&sort[]=id,desc&columns=id,name,country,language,points',
    tableName: 'users'
});
```
Easy Object Output:
```Javascript
{
   "tableName":"users",
   "filter":[
      {
         "column":"age",
         "condition":">",
         "value":"18"
      },
      {
         "column":"language",
         "condition":"IN",
         "value":[
            "english",
            "arabic"
         ]
      }
   ],
   "sorts":[
      {
         "column":"points",
         "type":"DESC"
      },
      {
         "column":"id",
         "type":"DESC"
      }
   ],
   "columns":[
      "id",
      "name",
      "country",
      "language",
      "points"
   ]
}
```

## Quick Start
via npm
```bash
npm install @alinoaimi/query_translate
```
then define it:
```javascript
const QueryTranslate = require('query_translate') // using require
import QueryTranslate from 'query_translate' // es6 import
```

