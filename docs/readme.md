## Foods Api

This project implements a [querypoint](https://github.com/DataIntegrated/querypoint) api

**mutations** are requests that make changes to the DB, and these are sent through `/v1/mutations`  

eg. to create a product
send a http `POST` to `/v1/mutations` with the json body
```json
{
  "name": "productCreate",
  "params": {
    "sku": 1001,
    "description": "gold bowl",
    "price": 100
  }
}
```

and... to create a cashier
```json
{
  "name": "cashierCreate",
  "params": {
    "name": "Alphonse",
    "phone": 0710235698
  }
}
```

**queries** are requests that read from the db without making any changes; requests are in [graphql](http://graphql.org/) syntax.

eg. get the list of products on organization has
send a graphql string via http `POST`
```yaml
query {
  user(id: 2390) {
    organization(id: 3456) {
      products {
        sku, decscription, price
      }
    }
  }
}
```
**documentation**
The documentation endpoint is `/v1/description`. This list all DataTypes in the system and the mutations and queries that can be done on them.

