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
    messages: async (
      _: any,
      args: { conversationId: string },
      context: GraphQLContext
    ): Promise<Array<MessagePopulated>> => {
      const { session, prisma, pubsub } = context;
      const { conversationId } = args;

      if (!session?.user) {
        throw new GraphQLError('Not authorized');
      }

      const {
        user: { id: userId },
      } = session;

      const conversation = await prisma.conversation.findUnique({
        where: {
          id: conversationId,
        },
        include: conversationPopulated,
      });

      if (!conversation) {
        throw new GraphQLError('Conversation not found');
      }

      if (!userIsConversationParticipant(conversation.participants, userId)) {
        throw new GraphQLError('Not authorized');
      }

      try {
        const messages = await prisma.message.findMany({
          where: {
            conversationId,
          },
          include: messagePopulated,
          orderBy: {
            createdAt: 'desc',
          },
        });

        if (messages.length > 0) {
          const filteredMessages = messages.filter((message) => {
            if (conversation.recommendationStartDate === null) return true;
            return message.createdAt > conversation.recommendationStartDate;
          });
          const recommendationInput = filteredMessages
            .map((message) => message.body)
            .join(' ');
          console.log(recommendationInput);
          const {
            data: { businessIds },
          } = await axios.post('http://127.0.0.1:5000/recommend', {
            input_text: recommendationInput,
            headers: {
              'Content-Type': 'application/json',
            },
          });

          const restaurants = await prisma.restaurant.findMany({
            where: {
              business_id: {
                in: businessIds,
              },
            },
          });

          pubsub.publish('RESTAURANTS_RECOMMENDED', {
            restaurantsRecommended: restaurants,
            conversationId,
          });
        }

        return messages;
      } catch (error: any) {
        console.log('Messages error:', error);
        throw new GraphQLError(error?.message);
      }
    },
  },
  Mutation: {
    sendMessage: async (
      _: any,
      args: SendMessageArguments,
      context: GraphQLContext
    ): Promise<boolean> => {
      const { session, prisma, pubsub } = context;
      const { id: messageId, senderId, conversationId, body } = args;

      if (!session?.user) {
        throw new GraphQLError('Not authorized');
      }

      const {
        user: { id: userId },
      } = session;

      if (userId !== senderId) throw new GraphQLError('Not authorized');

      try {
        /**
         * Create new message entity
         */
        const newMessage = await prisma.message.create({
          data: {
            id: messageId,
            senderId,
            conversationId,
            body,
          },
          include: messagePopulated,
        });

        pubsub.publish('MESSAGE_SENT', { messageSent: newMessage });

        /**
         * Find ConversationParticipant entity
         */
        const participant = await prisma.conversationParticipant.findFirst({
          where: {
            userId,
            conversationId,
          },
        });

        if (!participant) {
          throw new GraphQLError('ConversationParticipant not found');
        }

        /**
         * Update conversation entity
         */
        const conversation = await prisma.conversation.update({
          where: {
            id: conversationId,
          },
          data: {
            latestMessageId: newMessage.id,
            participants: {
              update: {
                where: {
                  id: participant.id,
                },
                data: {
                  hasSeenLatestMessage: true,
                },
              },
              updateMany: {
                where: {
                  NOT: {
                    userId,
                  },
                },
                data: {
                  hasSeenLatestMessage: false,
                },
              },
            },
          },
          include: conversationPopulated,
        });

        const messages = await prisma.message.findMany({
          where: {
            conversationId,
            createdAt: conversation.recommendationStartDate
              ? {
                  gte: conversation.recommendationStartDate,
                }
              : undefined,
          },
          include: messagePopulated,
          orderBy: {
            createdAt: 'desc',
          },
        });

        const recommendationInput = messages
          .map((message) => message.body)
          .join(' ');
        console.log(recommendationInput);
        const {
          data: { businessIds },
        } = await axios.post('http://127.0.0.1:5000/recommend', {
          input_text: recommendationInput,
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const restaurants = await prisma.restaurant.findMany({
          where: {
            business_id: {
              in: businessIds,
            },
          },
        });

        pubsub.publish('RESTAURANTS_RECOMMENDED', {
          restaurantsRecommended: restaurants,
          conversationId,
        });

        // pubsub.publish('MESSAGE_SENT', { messageSent: newMessage });
        pubsub.publish('CONVERSATION_UPDATED', {
          conversationUpdated: { conversation },
        });
      } catch (error: any) {
        console.log('sendMessage error: ', error);
        throw new GraphQLError(error?.message);
      }

      return true;
    },
  },
  Subscription: {
    messageSent: {
      subscribe: withFilter(
        (_: any, __: any, context: GraphQLContext) => {
          const { pubsub } = context;
          return pubsub.asyncIterator(['MESSAGE_SENT']);
        },
        (
          payload: MessageSentSubscriptionPayload,
          args: { conversationId: string },
          context: GraphQLContext
        ) => {
          return payload.messageSent.conversationId === args.conversationId;
        }
      ),
    },
  },
};

export const messagePopulated = Prisma.validator<Prisma.MessageInclude>()({
  sender: {
    select: {
      id: true,
      username: true,
    },
  },
});

export default resolvers;
