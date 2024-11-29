export const schema = `#graphql
type Flight {
  id: ID!
  origin: String!
  destination: String!
  dateAndTime: String!
}

type Query {
  flights(origin: String, destination: String): [Flight!]!
  flight(id: ID!): Flight
}

type Mutation {
  addFlight(origin: String!, destination: String!,  dateAndTime: String!): Flight!
}
`;
