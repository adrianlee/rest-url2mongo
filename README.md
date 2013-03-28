# Authentication
Basic Authorization via HTTP Headers

Each HTTP request should include the follow header which provides a users's credentials via the basic access authentication method. The base64 string is the encoded string "username:password"
`Authorization: Basic QWxhZGRpbjpvcGVuIHNlc2FtZQ==`

Each request will do a quick lookup with the DB for valid user credentials.

Idealy, we would want requests to be served through a secure connection via HTTPS protocol.

# Endpoints
Querystring parameters:
json

Body payload:
Valid json string.

By default, query requests return and array of all documents maching query conditions.


endpoint | method | description
--- | --- | ---
`/<collection>/<id>` | GET | [Retrieving Objects](#Retrieving)
`/<collection>` | POST | [Create Objects](#Create)
`/<collection>/<id>` | PUT | [Updating Objects](#Updating)
`/<collection>` | GET | [Querying for Object](#Querying)
`/<collection>/<id>` | DELETE | [Deleting Objects](#Deleting)


## <a name="Retrieving"></a>Retrieving
`GET /library/12345`

Maps to:

Method: findOne()
Collection: "library"
Document id: "12345"


## <a name="Create"></a>Creating Objects
`POST /library`

Maps to:

Method: insert()
Collection: "library"



## <a name="Updating"></a>Updating Objects
`PUT /library/12345`

Maps to:

Method: update() w/ upsert flag set to true ( performs an insert if no documents match )
Collection: "library"
Document id: "12345"


## <a name="Querying"></a>Querying Objects
### Filtering
`GET /library?filter={"id": "12345"}`

`GET /library?filter={"book": "bk101"}`

`GET /library?filter={"publish_date": {"$gte": 1990}}`

### Order By

`GET /library?orderBy={"book": "asc"}`

`GET /library?orderBy={"book": "desc"}`

### Limit

`GET /library?limit=10`

## <a name="Deleting"></a>Deleting Objects

## Other query conditions which we may implement/map

- or
- nor
- and
- gt
- gte
- lt
- lte
- ne
- in
- nin

`DELETE /library/12345`

Maps to:

Method: remove()
Collection: library
Document id: "12345"
