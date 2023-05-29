# Jamie's Shopping Cart

## Installation
Run the docker-compose file to start the app and wait for ` Server is running on port 8080`

Running Docker Compose down is recommend for new node modules and db changesets.

Please ensure that no postgres instances are running locally on port 5432
```bash 
docker-compose down
docker-compose up
```

### Recommend way to run
It is highly recommended that this is used with an api tool like postman or insomnia.

#### <b>Please consider using the included collection under `./api-collection.json`</b>

Alternatively run the curl commands from below and paste them in the chosen api tool or terminal

## Assumptions
1. I assumed that promotions involving quantity discounts can be stacked
2. I enforce that one item can only have one promotion
3. If a product is deleted then it will be deleted from the cart and promotions
4. If a promotion is deleted then it will be deleted from the cart
5. The "Buy more than X get Y free" is implied in the example to be "equal to or more than". I have followed the examples logic
6. I have assumed that we would want to provide a message regarding the promotion on promotion items
7. I assume we want to get a fresh cart with each request. This is to not have to mutate global and potentially stale/ invalid data
8. Checking stock levels was not implemented as it was not a requirement but strongly considered. A message field would have been implemented if time permitted

## Comments about the implementation
1. I decided to have fun with this assignment. This meant that more time was spent playing with the data model and docker than on the actual implementation.
2. Ideally this would have been written test first. Testing would provide clarity on the requirements and would have helped via unit tests and BDD test.
3. If I had more time I would have properly typed all inputs
4. I normally would appropriately wrap unrecoverable scenarios in a try catch and log/ handle errors
5. Proper environment variables would be used in a production environment with no hard coded values
6. Ideally carts would ideally be tied to a logged-in user if one exists
7. Ideally arts without a logged-in user would expire after a certain amount of time
8. Consistency and style would be maintained in a production environment/ non-quick and dirty implementation
9. Proper restful endpoints would have been considered
10. I wanted to show the flexibility of the promotions by adding a rest endpoint for adding promotions
11. If a promotion is added for an sku and has the same type it will be an update. If it is a new promotion type it will remove the previous promotion
12. Promotions are validated against the promotion type to ensure type safety
13. I added an endpoint for adding a product but didn't validate it/ didn't handle edge cases as this was a last minute addition that I didn't have time to fully implement
14. I would have liked to use inversify or NestJS to allow for IOC and better practices
15. I would have fixed the issue where the db fields save in all lower case causing me to have to do odd mappings in the promotions
16. ESLint would have been used to enforce strict rules
17. I ignored that real carts could have a range of skus applying to a promotion/ product category or brand
18. Anything else obvious :)

## Usage

### Adding an item to the test cart (Raspberry Pi)
```bash
curl --request POST --url http://localhost:8080/api/cart/item --header 'Content-Type: application/json' --data '{ "cartId": "DUMMY_CART", "sku": "234234", "quantity": 1}'
```

### Deleting an item from the test cart (Macbook Pro)
```bash
curl --request DELETE --url http://localhost:8080/api/cart/item --header 'Content-Type: application/json' --data '{ "cartId": "DUMMY_CART", "sku": "43N23P"}'
```

### Getting the test cart
```bash
curl --request GET --url http://localhost:8080/api/cart/DUMMY_CART --header 'Content-Type: application/json'
```

### Clearing the test cart 
```bash
curl --request DELETE --url http://localhost:8080/api/cart --header 'Content-Type: application/json' --data '{ "cartId": "DUMMY_CART"}'
```


### Creating a new cart and getting the cart id
```bash
curl -X POST -H "Content-Type: application/json" -d '{}' 'http://localhost:8080/api/cart'
```

### Adding a promotion
```bash
curl --request POST --url http://localhost:8080/api/promotions --header 'Content-Type: application/json' --data '{ "sku": "120P90", "type": "buyXGetYFree",	"qty": 1, "freeItemSku": "A304SD" }'
```