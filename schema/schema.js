/* Schema serves thre purposes:
 *  1. Defines data on the Graph like object types like BookType.
 *  2. Defines relation between these object types.
 *  3. Describes how to reach into the graph to interact with the data to retrieve or mute the data.
 */

const graphql = require('graphql');

const { GraphQLObjectType, GraphQLString, GraphQLID, GraphQLInt, GraphQLSchema } = graphql;// TODO how does this line work exactly ?

var fakeBookDatabase = [
    { name: "Book 1", pages: 432, id: 1 },
    { name: "Book 2", pages:  32, id: 2 },
    { name: "Book 3", pages: 532, id: 3 }
];

//Schema defines data on the Graph like object types(book type), relation between
//these object types and descibes how it can reach into the graph to interact with
//the data to retrieve or mutate the data

const BookType = new GraphQLObjectType({
    name: 'Book',
    fields: () => ({
        id:    { type: GraphQLID     },
        name:  { type: GraphQLString },
        pages: { type: GraphQLInt    }
    })
});

const RootQuery = new GraphQLObjectType({
   name: 'RootQueryType',
   fields: {
       book: {
           type: BookType,
           args: { id: { type: GraphQLID }},
           resolve(parent, args) {
               // Here we define how to get data from database source
               // This will return the book with id passed in argument by the user
               return fakeBookDatabase.find( (item) => { return item.id == args.id });
           }
       }
   }
});

module.exports = new GraphQLSchema({ query: RootQuery });