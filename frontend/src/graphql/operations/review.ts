import { gql } from '@apollo/client';

const ReviewOperations = {
  Queries: {
    reviewsForRestaurant: gql`
      query ReviewsForRestaurant($restaurantId: String!) {
        reviewsForRestaurant(restaurantId: $restaurantId) {
          id
          content
          rating
          createdAt
          updatedAt
          user {
            id
            name
          }
          restaurant {
            id
            name
          }
        }
      }
    `
  },
  Mutations: {
    createReview: gql`
      mutation CreateReview(
        $restaurantId: String!
        $userId: String!
        $rating: Float!
        $content: String!
      ) {
        createReview(
          restaurantId: $restaurantId
          userId: $userId
          rating: $rating
          content: $content
        ) {
          id
          content
          rating
          createdAt
          updatedAt
          user {
            id
            name
          }
          restaurant {
            id
            name
          }
        }
      }
    `,
  },
};

export default ReviewOperations;
