#### GraphQL Example Project

This is a simple project that uses Mongoose, MongoDB, Express, and GraphQL to
demonstrate some core GraphQL capabilities.

#### Getting Started

    docker-compose up   # Setup a local MongoDB via Docker.
    npm install         # Install node module dependencies via NPM  .
    npm run dev         # Run the "dev" task in package.json to startup the app.

Go to localhost:3000/graphql in your browser.

#### Queries & Mutations

Use the following queries and mutations in your browser to experiment with the
 GraphQL API.

##### Add an author

    mutation {
      addAuthor(name: "Bobby", age:18) {
        name
        age
      }
    }

##### Get all authors & their books

    query {
      authors {
        id
        name
        book {
          name
        }
      }
    }
    
##### Add a book

    mutation {
      addBook(
        name: "Hive Mind", 
        pages: 100, 
        authorID: "5f1311a487f43e3355f34c84"
      ) {
        name
        pages
      }
    }

##### Get all books

    query {
      books {
        id
        name
        pages
      }
    }
    
##### Get one author by id
    
    query {
      author(id: "5f1311a487f43e3355f34c84"){
        id
        name
        book {
          name
        }
      }
    }

#### Reference

https://medium.com/@utkarshprakash/setting-up-graphql-server-with-nodejs-express-and-mongodb-d72fba13216