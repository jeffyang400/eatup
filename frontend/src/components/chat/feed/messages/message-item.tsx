import { Avatar, Flex, Stack, Text } from '@chakra-ui/react';
import { formatRelative } from 'date-fns';
import enUS from 'date-fns/locale/en-US';
import { MessagePopulated } from '../../../../../../backend/src/util/types';

interface MessageItemProps {
  message: MessagePopulated;
  sentByMe: boolean;
}

const formatRelativeLocale = {
  lastWeek: ""
}

const MessageItem: React.FC<MessageItemProps> = ({ message, sentByMe }) => {
  return (
    <Stack
      direction="row"
      p={4}
      spacing={4}
      _hover={{ bg: 'grayAlpha.200' }}
      wordBreak="break-word"
      border="1px solid red"
    >
      {!sentByMe && (
        <Flex>
          <Avatar size="sm" />
        </Flex>
      )}
      <Stack spacing={1} width="100%">
        <Stack direction="row" align='center' justify={sentByMe ? "right" : "left"}>
          {
            !sentByMe && <Text fontWeight={500} textAlign='left'>{message.sender.username}</Text>
          }
          {/* <Text fontSize={14}>
            {
              formatRelative(message.createdAt, new Date(), {
                locale: {
                  ...enUS,
                  formatRelative: (token) => {
                    formatRelativeLocale[token as keyof typeof formatRelativeLocale]
                  }
                }
              })
            }
          </Text> */}
        <Text>{message.body}</Text>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default MessageItem;
