import { Restaurant } from '@prisma/client';
import { GraphQLError } from 'graphql';
import { withFilter } from 'graphql-subscriptions';
import { GraphQLContext } from '../../util/types';

const resolvers = {
  Query: {
    restaurant: async (
      _: any,
      args: { id: string },
      context: GraphQLContext
    ): Promise<Restaurant> => {
      const { id: restaurantId } = args;
      const { prisma } = context;

      try {
        const restaurant = await prisma.restaurant.findFirst({
          where: {
            id: restaurantId,
          },
        });

        if (!restaurant) {
          throw new GraphQLError('Restaurant not found');
        }

        return restaurant;
      } catch (error: any) {
        console.log('restaurant error: ', error);
        throw new GraphQLError(error?.message);
      }
    },
    restaurants: async (
      _: any,
      __: any,
      context: GraphQLContext
    ): Promise<Array<Restaurant>> => {
      const { prisma } = context;

      try {
        const restaurants = await prisma.restaurant.findMany();

        if (!restaurants) {
          throw new GraphQLError('Restaurant not found');
        }

        return restaurants;
      } catch (error: any) {
        console.log('restaurants error: ', error);
        throw new GraphQLError(error?.message);
      }
    },
  },
  Subscription: {
    restaurantsRecommended: {
      subscribe: withFilter(
        (_: any, __: any, context: GraphQLContext) => {
          const { pubsub } = context;
          return pubsub.asyncIterator(['RESTAURANTS_RECOMMENDED']);
        },
        (
          payload: any,
          args: { conversationId: string },
          context: GraphQLContext
        ) => {
          return payload.conversationId === args.conversationId;
        }
      ),
    },
  },
};

export default resolvers;
