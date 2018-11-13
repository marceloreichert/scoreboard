# ScoreBoard

## Dependencies

- Node v8.10+
- MongoDB 3.0.12+


## Install NPM dependencies

```
npm install
```

## Executar

```
npm start
```


## Tests

```
npm test
```

## Endpoints
* `POST /api/scoreboard`
* `GET /api/scoreboard`
* `POST /api/gist`
* `GET /api/gist/:id/comments`


## Environment Variables

* `NODE_ENV` - _String_
* `PORT` - _String_
* `MONGO_URL` - _String_
* `MONGO_URL_TEST` - _String_
* `NODE_ENV=test` - _String_
* `HOST` - _String_
* `GITHUB_USER` - _String_
* `GITHUB_PASSWORD` - _String_


## Example to add Gist file
```
{
  "description": "Hello World Examples",
  "public": true,
  "files": {
    "hello_world.rb": {
      "content": "class HelloWorld\n   def initialize(name)\n      @name = name.capitalize\n   end\n   def sayHi\n      puts \"Hello !\"\n   end\nend\n\nhello = HelloWorld.new(\"World\")\nhello.sayHi"
    }
  }
}
```
