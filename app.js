const express = require('express');
const bodyParser = require('body-parser');
const {graphqlHTTP} = require('express-graphql');
const {buildSchema} = require('graphql')
const mongoose = require('mongoose');
require('dotenv').config();

const events = [];

const app = express();
const PORT = process.env.PORT || 4000;
const MONGO_URL = process.env.MONGO_URL

app.use(bodyParser.json());

app.get('/', (req, res, next)=> {
    res.send('Hellow World')
})

app.use('/graphql', graphqlHTTP({
    schema: buildSchema(`
    type Event {
        _id: ID!
        tilte: String!
        description: String!
        price: Float!
        date: String!
    }

    input EventInput {
        title: String!
        description: String!
        price: Float!
        date: String!
    }
    type RootQuery {
        events: [Event!]!
    }

    type RootMutation {
        creactEvent(eventInput: EventInput): Event
    }
    schema {
        query: RootQuery
        mutation: RootMutation
    }
    `),
    rootValue: {
        events: ()=> {
            return events;
        },
        createEvent: (args)=> {
            console.log(args)
            const event = {
                _id: Math.random().toString(),
                title: args.eventInput.title,
                description: args.eventInput.description,
                price: args.eventInput.price,
                date: args.eventInput.date
            }
            events.push(args);
            return event;
        }
    },
    graphiql: true
}))

mongoose.connect(MONGO_URL,(err)=>{!err? console.log('connected'): console.log(err)})

app.listen(PORT,()=>console.log('serrver is running to port ', PORT));