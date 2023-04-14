import { Message, Prisma } from '@prisma/client';
import { GraphQLError } from 'graphql';
import { withFilter } from 'graphql-subscriptions';
import {
  GraphQLContext,
  MessagePopulated,
  MessageSentSubscriptionPayload,
  SendMessageArguments,
} from '../../util/types';
import { userIsConversationParticipant } from '../../util/functions';
import { conversationPopulated } from './conversation';
import axios from 'axios';

const resolvers = {
  Query: {
    reviewsForRestaurant: async (
      _: any,
      args: any,
      context: GraphQLContext
    ) => {

      const { prisma } = context;
      const { restaurantId } = args;
      const reviews = await prisma.review.findMany({
        where: {
          restaurantId,
        },
        include: {
          user: true,
        },
      });
      return reviews;
    },
  },
  Mutation: {
    createReview: async (_: any, args: any, context: GraphQLContext) => {
      const { session, prisma } = context;
      const { restaurantId, userId, rating, content } = args;

      // Check if the user is logged in
      if (!session?.user) {
        throw new GraphQLError('Not authorized');
      }

      // Check that all required input fields are present
      if (!restaurantId || !userId || !rating || !content) {
        throw new GraphQLError('Missing required input fields');
      }

      // Check that input types are valid
      if (typeof rating !== 'number' || typeof content !== 'string') {
        throw new GraphQLError('Invalid input types');
      }

      // Check if the user and restaurant exist
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });
      if (!user) {
        throw new GraphQLError('User not found');
      }

      const restaurant = await prisma.restaurant.findUnique({
        where: { id: restaurantId },
      });
      if (!restaurant) {
        throw new GraphQLError('Restaurant not found');
      }

      // Create the review
      const review = await prisma.review.create({
        data: {
          content,
          rating,
          user: { connect: { id: userId } },
          restaurant: { connect: { id: restaurantId } },
        },
        include: {
          user: true,
          restaurant: true,
        },
      });

      // Add the review to the user and restaurant's reviews array
      await prisma.user.update({
        where: { id: userId },
        data: { reviews: { connect: { id: review.id } } },
      });
      await prisma.restaurant.update({
        where: { id: restaurantId },
        data: { reviews: { connect: { id: review.id } } },
      });

      return review;
    },
  },
};

export default resolvers;
