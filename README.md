# Authentication
## Basic Authorization via HTTP Headers

Each HTTP request should include the follow header which provides a users's credentials via the basic access authentication method. The base64 string is the encoded string "username:password"
`Authorization: Basic QWxhZGRpbjpvcGVuIHNlc2FtZQ==`

Each request will do a quick lookup with the DB for valid user credentials.

Idealy, we would want requests to be served through a secure connection via HTTPS protocol.

Users should be stored in the 'User' collection which only the admin has access permissions.

## Cookies

After a successful HTTP request with authentication credentials, the server should generate a hash with a timeout timestamp which indicates the cookie's expiration date.

This hash should be stored in memory and could contain relevant session information such as a users information needed for future requests which do not require a DB lookup on the Users collections.

The generated hashes for each unqiue user should persist and be passed around in `Cookie` field of the the reqeust and response headers of each request.

Set-Cookie: NAME=VALUE; expires=DATE;

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

`GET /library?filter={"book.publisher": "oreilly"}`

`GET /library?filter={"publish_date": {"$gte": 1990}}`

### Order By

`GET /library?orderBy={"book": "asc"}`

`GET /library?orderBy={"book": "desc"}`

### Limit

`GET /library?limit=10`

### Other query conditions which we may implement/map
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

## <a name="Deleting"></a>Deleting Objects


`DELETE /library/12345`

Maps to:

Method: remove()
Collection: library
Document id: "12345"



# Response Codes

Similar to Lab 3, request results are indicated by the HTTP status code. A 2xx status code indicates success, whereas a 4xx status code indicates failure. When a request fails, the response body is still JSON, but always contains the fields code and error which you can inspect to use for debugging.

``` json
{
  "error": "cannot find document",
  "code": 404
}
```
