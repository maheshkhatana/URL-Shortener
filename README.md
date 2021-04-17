# URL-Shortener


## Building a URL Shortener Microservice

:one: User can POST a URL to [project_url]/api/shorturl/new and it will receive a shortened URL in the JSON response.

`Example : {"original_url":"www.google.com","short_url":1}`

:two: If user passes an invalid URL that doesn't follow the http(s)://www.example.com(/more/routes) format, the JSON response will contain an error.

`{"error":"invalid URL"}`

:three: When user visits the shortened URL, it will redirect the user to the original link.


### Example Usage:

`[base url]/api/shortcut/TPRev`


### Will Redirect To:

`https://github.com`

## Technologies used:

:one: Node

:two: Express

