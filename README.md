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
`GET /library?where={"id": "12345"}`

`GET /library?where={"book": "bk101"}`

`GET /library?where={"publish_date": {"$gte": 1990}}`

### Deleting Objects

`DELETE /library/12345`