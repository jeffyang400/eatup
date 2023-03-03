import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import {
  Box,
  Button,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
} from '@chakra-ui/react';
import { useState } from 'react';
import UserOperations from '@/graphql/operations/user';
import ConversationOperations from '@/graphql/operations/conversation';
import {
  CreateConversationData,
  CreateConversationInput,
  SearchedUser,
  SearchUsersData,
  SearchUsersInput,
} from '@/util/types';
import UserSearchList from './user-search-list';
import Participants from './participants';
import { toast } from 'react-hot-toast';
import { Session } from 'next-auth';
import { useRouter } from 'next/router';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  session: Session;
}

const ConversationModal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  session,
}) => {
  const {
    user: { id: userId },
  } = session;

  const router = useRouter();

  const [username, setUsername] = useState('');
  const [participants, setParticipants] = useState<Array<SearchedUser>>([]);
  const [searchUsers, { data, loading, error }] = useLazyQuery<
    SearchUsersData,
    SearchUsersInput
  >(UserOperations.Queries.searchUsers);

  const [createConversation, { loading: createConversationLoading }] =
    useMutation<CreateConversationData, CreateConversationInput>(
      ConversationOperations.Mutations.createConversation
    );

  console.log('SEARCH DATA', data);

  const onCreateConverstation = async () => {
    const participantIds = [...participants.map((p) => p.id), userId];
    try {
      const { data } = await createConversation({
        variables: {
          participantIds,
        },
      });

      if (!data?.createConversation) {
        throw new Error('Could not create conversation');
      }

      const {
        createConversation: { conversationId },
      } = data;

      router.push({ query: { conversationId }});

      /**
       * Clear state and close modal after creating conversation
       */
      setParticipants([]);
      setUsername('');
      onClose();
    } catch (error: any) {
      console.log('CREATE CONVO ERROR', error);
      toast.error(error?.message);
    }
  };

  const onSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    searchUsers({ variables: { username } });
    console.log('IN ON SUBMIT', username);
  };

  const addParticipant = (user: SearchedUser) => {
    setParticipants((prev) => [...prev, user]);
    setUsername('');
  };

  const removeParticipant = (userId: string) => {
    setParticipants((prev) => prev.filter((p) => p.id !== userId));
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent pb={4}>
          <ModalHeader>Create Group</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={onSearch}>
              <Stack spacing={4}>
                <Input
                  placeholder="Enter a username"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                  }}
                />
                <Button type="submit" isLoading={loading}>
                  Search
                </Button>
              </Stack>
            </form>
            {data?.searchUsers && (
              <UserSearchList
                users={data.searchUsers}
                addParticipant={addParticipant}
                removeParticipant={removeParticipant}
              />
            )}
            {participants.length > 0 && (
              <>
                <Participants
                  participants={participants}
                  removeParticipant={removeParticipant}
                />
                <Button
                  bg="brand.100"
                  width="100%"
                  mt={6}
                  isLoading={createConversationLoading}
                  onClick={onCreateConverstation}
                >
                  Create Group
                </Button>
              </>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ConversationModal;
