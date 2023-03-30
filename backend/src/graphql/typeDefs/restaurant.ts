import { gql } from 'graphql-tag';

const typeDefs = gql`
  type Restaurant {
    id: String!
    business_id: String!
    name: String!
    address: String!
    city: String!
    state: String!
    postal_code: Int!
    latitude: Float!
    longitude: Float!
    stars: Float!
    review_count: Int!
    is_open: Int!
    attributes: String!
    categories: String!
    hours: String!
    eatup_rating: Float
    reviews: [Review!]!
  }

  type Query {
    restaurant(id: String!): Restaurant
    restaurants: [Restaurant]
  }

  type Mutation {
    createRestaurant(
      business_id: String!
      name: String!
      address: String!
      city: String!
      state: String!
      postal_code: Int!
      latitude: Float!
      longitude: Float!
      stars: Float!
      review_count: Int!
      is_open: Int!
      attributes: String!
      categories: String!
      hours: String!
      eatup_rating: Float
    ): Restaurant!
  }

  type Subscription {
    restaurantCreated: Restaurant!
  }
`;

export default typeDefs;
