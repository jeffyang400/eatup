import userResolvers from './user';
import conversationResolvers from './conversation';
import messageResolvers from './message';
import scalarResolvers from './scalars';
import restaurantResolvers from './restaurant';
import reviewResolvers from './review';
import merge from 'lodash.merge';

const resolvers = merge(
  {},
  userResolvers,
  conversationResolvers,
  messageResolvers,
  scalarResolvers,
  restaurantResolvers,
  reviewResolvers
);

export default resolvers;
