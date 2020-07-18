/* Schema serves thre purposes:
 *  1. Defines data on the Graph like object types like BookType.
 *  2. Defines relation between these object types.
 *  3. Describes how to reach into the graph to interact with the data to retrieve or mute the data.
 */

const graphql = require('graphql');
const Book = require('../models/book');
const Author = require('../models/author');

const { GraphQLObjectType, GraphQLString, GraphQLID, GraphQLInt, GraphQLSchema, GraphQLList, GraphQLNonNull} = graphql;// TODO how does this line work exactly ?

// Dummy Book's Database. Used prior to the addition of Mongoose / MongoDB.
// var fakeBookDatabase = [
//     { name: "Book 1", pages: 432, id: 1 },
//     { name: "Book 2", pages:  32, id: 2 },
//     { name: "Book 3", pages: 532, id: 3 }
// ];

//Schema defines data on the Graph like object types(book type), relation between
//these object types and descibes how it can reach into the graph to interact with
//the data to retrieve or mutate the data

const BookType = new GraphQLObjectType({
    name: 'Book',
    fields: () => ({
        id:    { type: GraphQLID     },
        name:  { type: GraphQLString },
        pages: { type: GraphQLInt    },
        author: {
            type: AuthorType,                           // A GraphQL type defined below.
            resolve(parent, args){
                return Author.findById(parent.authorID);// Book author is just an id reference so we can use that id to query for the author.
            }
        }
    })
});

const AuthorType = new GraphQLObjectType({
    name: 'Author',
    fields: () => ({
        id:   { type: GraphQLID     },
        name: { type: GraphQLString },
        age:  { type: GraphQLInt    },
        book: {
            type: new GraphQLList(BookType),
            resolve(parent,args){
                return Book.find({ authorID: parent.id });// To get the author's books just lookup at the books#authorId field.
            }
        }
    })
})



const RootQuery = new GraphQLObjectType({
   name: 'RootQueryType',
   fields: {
       book: {                              // How do you lookup a single book?
           type: BookType,                  // A single book.
           args: { id: { type: GraphQLID }},// Requires a book id to look up the book.
           resolve(parent, args) {
               // Here we define how to get data from database source
               // This will return the book with id passed in argument by the user
               return Book.findById(args.id);
           }
       },
       books: {                             // How do you browse all books ?
           type: new GraphQLList(BookType), // A list of Books.
           resolve(parent, args) {
               return Book.find({});
           }
       },
       author: {                            // How do you lookup a single author?
           type: AuthorType,                // A single author
           args: { id: { type: GraphQLID }},// Requires an author id to look up the author.
           resolve(parent, args) {
               return Author.findById(args.id);// Query MongoDB via Mongoose
           }
       },
       authors: {                            // How do you browse all authors ?
           type: new GraphQLList(AuthorType),// A list of Authors.
           resolve(parent, args){
               return Author.find({});
           }
       }
   }
});

// Very similar to RootQuery helps user to add/update to the database.
const Mutation = new GraphQLObjectType({
   name: 'Mutation',
   fields: {
       addAuthor: {// How do I add a new author?
          type: AuthorType,
          args: {
              // GraphQLNonNull = Make fields required
              name: { type: new GraphQLNonNull(GraphQLString) },
              age:  { type: new GraphQLNonNull(GraphQLInt)    }
          } ,
           resolve(parent, args) {
              // Convert the data into an Author model and persist via Mongoose.
              return new Author({ name: args.name, age: args.age  }).save();
           }
       },
       addBook: {// How do I add a new book?
           type: BookType,
           args: {
               name:     { type: new GraphQLNonNull(GraphQLString) },
               pages:    { type: new GraphQLNonNull(GraphQLInt)    },
               authorID: { type: new GraphQLNonNull(GraphQLID)     }
           },
           resolve(parent, args){
               return new Book({ name: args.name, pages: args.pages, authorID: args.authorID }).save();
           }
       }
   }
});

module.exports = new GraphQLSchema({ query: RootQuery, mutation: Mutation });