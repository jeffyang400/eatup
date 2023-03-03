import { Box, Text } from '@chakra-ui/react';
import { Session } from 'next-auth';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { ConversationPopulated } from '../../../../../backend/src/util/types';
import ConversationItem from './conversation-item';
import ConversationModal from './modal/modal';

interface ConversationListProps {
  session: Session;
  conversations: Array<ConversationPopulated>;
  onViewConversation: (conversationId: string) => void;
}

const ConversationList: React.FC<ConversationListProps> = ({
  session,
  conversations,
  onViewConversation,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const onOpen = () => setIsOpen(true);
  const onClose = () => setIsOpen(false);

  const router = useRouter();
  const {
    user: { id: userId },
  } = session;

  return (
    <Box width="100%">
      <Box
        py={2}
        px={4}
        mb={4}
        bg="blackAlpha.300"
        borderRadius={4}
        cursor="pointer"
        onClick={onOpen}
      >
        <Text textAlign="center">Find or start a conversation</Text>
      </Box>
      <ConversationModal isOpen={isOpen} onClose={onClose} session={session} />
      {conversations.map((conversation) => {
        return (
          <ConversationItem
            key={conversation.id}
            userId={userId}
            conversation={conversation}
            onClick={() => {
              onViewConversation(conversation.id);
            }}
            isSelected={conversation.id === router.query.conversationId}
            hasSeenLatestMessage={true}
            onDeleteConversation={() => {
              
            }}
          />
        );
      })}
    </Box>
  );
};

export default ConversationList;
