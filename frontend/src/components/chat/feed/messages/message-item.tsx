import { Avatar, Box, Flex, Stack, Text } from '@chakra-ui/react';
import { formatRelative } from 'date-fns';
import enUS from 'date-fns/locale/en-US';
import { MessagePopulated } from '../../../../../../backend/src/util/types';
import styles from '../../../../styles/message-item.module.css';

interface MessageItemProps {
  message: MessagePopulated;
  sentByMe: boolean;
  renderHeader: boolean;
}

const formatRelativeLocale = {
  lastWeek: "eeee 'at' p",
  yesterday: "'Yesterday at' p",
  today: 'p',
  other: 'MM/dd/yy',
};

const MessageItem: React.FC<MessageItemProps> = ({
  message,
  sentByMe,
  renderHeader,
}) => {
  return (
    <div className={`${styles.container} ${sentByMe ? styles.sentByMe : ''}`} style={renderHeader ? {paddingTop: '0.5em'} : {}}>
      <div className={styles.messageContainer}>
        {renderHeader && (
          <div
            className={
              styles.messageHeader +
              (sentByMe ? ' ' + styles.messageHeaderSentByMe : '')
            }
          >
            {!sentByMe && (
              <div className={styles.messageHeaderSender}>
                {message.sender.username}
              </div>
            )}
            <div className={styles.messageHeaderTime}>
              <span>
                {formatRelative(message.createdAt, new Date(), {
                  locale: {
                    ...enUS,
                    formatRelative: (token) =>
                      formatRelativeLocale[
                        token as keyof typeof formatRelativeLocale
                      ],
                  },
                })}
              </span>
            </div>
          </div>
        )}
        <div className={styles.messageBody}>
          <div
            className={[
              styles.messageBubble,
              sentByMe
                ? styles.messageBubbleSentByMe
                : styles.messageBubbleSentByOther,
            ].join(' ')}
          >
            <span>{message.body}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageItem;
