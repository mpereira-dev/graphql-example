const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const schema = require('./schema/schema')
const mongoose = require('mongoose');

mongoose.connect('mongodb://myRootUser:myPassword@localhost')
mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB');
});

const app = express();
app.use('/graphql', graphqlHTTP({ schema, graphiql: true }));
app.listen(3000, () => {
    console.log('Listening on port 3000');
});