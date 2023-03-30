import { gql } from 'graphql-tag';

const typeDefs = gql`
  type Review {
    id: String
    content: String
    rating: Float
    createdAt: Date
    updatedAt: Date
    user: User!
    restaurant: Restaurant!
  }

  type Query {
    allReviews: [Review]
    reviewsByRestaurant(restaurantId: String): [Review]
    reviewsByUser(userId: String): [Review]
  }

  input CreateReviewInput {
    content: String!
    rating: Float!
    userId: String!
    restaurantId: String!
  }

  type Mutation {
    createReview(data: CreateReviewInput!): Review!
  }

  type Subscription {
    reviewCreated: Review!
  }
`;

export default typeDefs;
