import { SearchedUser } from "@/util/types";
import { Flex, Stack, Text } from "@chakra-ui/react";
import {GrClose} from 'react-icons/gr'

interface ParticipantsProps {
  participants: Array<SearchedUser>;
  removeParticipant: (userId: string) => void;
}

const Participants: React.FC<ParticipantsProps> = ({ participants, removeParticipant }) => {
  console.log('PARTICIPANTS', participants);
  
  return (
    <Flex mt={8} gap="10px" flexWrap="wrap">
      {participants.map((p) => (
        <Stack key={p.id} direction="row" align="center" background="gray.50" borderRadius={4} padding={2}>
          <Text>{p.username}</Text>
          <GrClose onClick={() => removeParticipant(p.id)} size={20} cursor="pointer"/>
        </Stack>
      ))}

    </Flex>
  );
};

export default Participants;