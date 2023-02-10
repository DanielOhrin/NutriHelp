# NutriHelp Documentation

The base route for all possible actions is `/api/userprofile`  
All API calls must include the header `Authorization: Bearer {firebaseToken}`  
  
_All instances of `firebaseUserId` are referring to the resource you are editing._

## /

### `POST`

`Request Body`: UserProfile object  
`Response:` 201

### `PUT`

`Request Body`: UserProfile object  
`Response:` 204

## /isDuplicateData

_This route is not suitable for production. I created it to learn debouncing._  

### `GET`

`query:` field(string)  
`query:` value(string)  
  
`Response:` 200  
`Response Body`: bool  

## /doesUserExist/:firebaseUserId

### `GET`

`Responses:`

- 204 (Exists)
- 409 (Account not active)
- 404 (Does not exist)

## /userType/:firebaseUserId

### `GET`

`Response:` 200  
`Response Body:` UserType object

## /:firebaseUserId

### `GET`

`query:` showDetails(bool) <-- Whether or not to fetch their daily rundown  
  
`Response:` 200  
`Response Body:` UserProfile object

## /all

### `GET`

`query:` increment(int) <-- Amount of rows to return  
`query:` offset(int)  <-- Amount to offset results by  
`query:` isActive(int) <-- Active or Inactive accounts  
  
`Response:` 200  
`Response Body`: AllUsersDTO <-- userProfiles(array of UserProfile objects) & total(int)

## /deactivate/:firebaseUserId

_Admin protected._

### `PATCH`

`Response:` 204

## /activate/:firebaseUserId

_Admin protected._

### `PATCH`

`Response:` 204

## /editStat/:firebaseUserId

### `PATCH`

`query:` field(string)  
`query:` value(int)  
  
`Response:` 204

## /meals/:firebaseUserId

### `GET`

`Response:` 200  
`Response Body:` Array of Meal objects

## /food

### `POST`

`query:` firebaseUserId(string)  
`Request Body:` AddMealDTO <-- mealIngredient object & mealTypeId(int)  
  
`Response:` 204  
  
### `DELETE`

`query:` foodId(int)  
`query:` mealId(int)  
  
`Response:` 204

### `PATCH`

`query:` foodId(int)
`query:` mealId(int)
`query:` newAmount(int)  
  
`Response:` 204
