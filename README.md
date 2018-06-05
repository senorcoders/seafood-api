# team-snap-api

API for seafood app 

## Getting Started
API development with sails


### Common Endpoints

All the models in the api have the following endpoints for create, destroy, update, find all, find one, search, populate

```
GET ALL => GET				http://server_address/api/:model_name
CREATE  => POST 			http://server_address/api/:model_name

GET ONE => GET				http://server_address/api/:model_name/:id
UPDATE  => PUT				http://server_address/api/:model_name/:id
DELETE  => DELETE 		http://server_address/api/:model_name/:id
```
####Search
SEARCH 	=> GET				http://server_address/api/:model_name?where={"name":{"contains":"theodore"}}

the api allow the followin criterias
```
    '<' / 'lessThan'
    '<=' / 'lessThanOrEqual'
    '>' / 'greaterThan'
    '>=' / 'greaterThanOrEqual'
    '!' / 'not'
    'like'
    'contains'
    'startsWith'
    'endsWith'
```
####Sort and Limit
In your GET petition you can ask the api for sort and/or limit the results
```
GET ALL => GET				http://server_address/api/:model_name?createdAt DESC&limit=30
```

### Current Models

```
Fish
FishType
Company
User
```

### Custom endpoints:
```
PUT /api/login 
```
## Params
```
- email
- password

POST /api/signup

## Params
- email
- firstName
- lastName
- password
- location 
- role 

example of role
"role": 0
0 for admin
1 for users normal


GET /api/fish/:page/:cantidad


GET /api/fish-type/:name/:page/:limit


GET /api/fish/:where     //where is joson

Example for where
GET /api/fish/{"quality":"good"}

```
#### for get multiple products with multiple ID's
```
GET /api/fish-ids/:array    //array is json

Example for array
GET /api/fish-ids/["5b0edb04f2cbe9223844ce2d","5b0f19eb48c1091b8c2710f8"]
```

#### for upload multiples images
```
POST /api/fish/images/:idProduct

the field of images has to be called images 

```
#### for delete image
```
DELETE /api/images/:namefile/:idProduct
```

### Prerequisites

```
sails js global

```

### Installing
Just run

```
npm install sails -g
npm install
```

### Run

```
sails lift
```
