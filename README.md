## Endpoints
endpoint | method | description
--- | --- | ---
`/<table>/<id>` | GET | [Retrieving Objects](Retrieving Objects)
`/<table>` | POST | [Create Objects]()
`/<table>/<id>` | PUT | [Updating Objects]()
`/<table>` | GET | [Querying for Object]()
`/<table>/<id>` | DELETE | [Deleting Objects]()


### Retrieving
`GET /library/12345`


### Creating Objects
`POST /library`


### Updating Objects
`PUT /library/12345`


### Querying Objects
#### Filtering
`GET /library?filter={"id": "12345"}`

`GET /library?filter={"book": "bk101"}`

`GET /library?filter={"publish_date": {"$gte": 1990}}`

#### Order By

`GET /library?orderBy={"book": "asc"}`

`GET /library?orderBy={"book": "desc"}`

#### Limit

`GET /library?limit=10`

### Deleting Objects

`DELETE /library/12345`
