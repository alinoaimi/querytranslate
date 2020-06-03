## QueryTranslate
QueryTranslate is a small Javascript library that converts HTTP GET Query Paramters to an easy to handle Javascript object, SQL Query or KnexJS object.

## Quick Example
Let's say you are building a rest API, using GET method to return a collection list

GET https://example.com/api/v1/users

You do not want to pass the filters and options in the body, because most API design guidelines recommend against that, so the only option left is passing them in the URL as query parameters, that's easy if you have very few pre-defined conditions, however, if you would like to enable complex filtering and sorting options, it could quickly get messy.

QueryTranslate defines a schema to pass the options, then converts it to the specified format (Javascript Object, SQL Query or KnexJS Object)

### Example
GET https://example.com/api/v1/users?filter[age][gt]=18&filter[language][in]=english&filter[language][in]=arabic&sort[]=points,desc&sort[]=id,desc&columns=id,name,country,language,points

will be converted to

SQL
```Javascript
let translatedQuery = QueryTranslate.translate({
    format: 'sql',
    query: 'filter[age][gt]=18&filter[language][in]=english&filter[language][in]=arabic&sort[]=points,desc&sort[]=id,desc&columns=id,name,country,language,points',
    tableName: 'users'
});
```
result:
```sql
SELECT id,name,country,language,points FROM `users` WHERE age > 18 AND language IN (`english`,`arabic`) ORDER BY points DESC, id DESC
```
Easy Object
```Javascript
let translatedQuery = QueryTranslate.translate({
    format: 'easy',
    query: 'filter[age][gt]=18&filter[language][in]=english&filter[language][in]=arabic&sort[]=points,desc&sort[]=id,desc&columns=id,name,country,language,points',
    tableName: 'users'
});
```
result:
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