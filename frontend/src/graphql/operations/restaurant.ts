import { gql } from '@apollo/client';

const RestaurantFields = `
  id
  business_id
  name
  address
  city
  postal_code
  is_open
  attributes
  categories
  hours
  eatup_rating
  stars
`;

const RestaurantOperations = {
  Queries: {
    restaurant: gql`
      query Restaurant($id: String!) {
        restaurant(id: $id) {
          ${RestaurantFields}
        }
      }
    `,
    restaurants: gql`
      query Restaurants {
        restaurants {
          ${RestaurantFields}
        }
      }
    `,
  },
};

export default RestaurantOperations;
