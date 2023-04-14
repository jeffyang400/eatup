import { gql } from 'graphql-tag';

const typeDefs = gql`
  type Review {
    id: String
    content: String
    rating: Float
    createdAt: Date
    updatedAt: Date
    user: User
    restaurant: Restaurant
  }

  type Query {
    allReviews: [Review]
    reviewsForRestaurant(restaurantId: String!): [Review]
    reviewsByUser(userId: String): [Review]
  }

  type Mutation {
    createReview(
      restaurantId: String!
      userId: String!
      content: String!
      rating: Float!
    ): Review!
  }

  type Subscription {
    reviewCreated: Review!
  }
`;

export default typeDefs;
