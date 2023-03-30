import {
  Box,
  Button,
  ButtonGroup,
  Container,
  Flex,
  HStack,
  IconButton,
  Text,
  useBreakpointValue,
} from '@chakra-ui/react';
import Link from 'next/link';
import { FiMenu } from 'react-icons/fi';

export default function Navbar() {
  return (
    <Box as="section" height="5vh" borderBottom="1px solid #e8e8e8" px={50} alignItems="center">
      <HStack height="5vh" spacing="10" justify="space-between">
        <Flex justify="space-between" flex="1">
          <HStack spacing="8">
            <Link href="/">Eatup</Link>
            <Link href="/chats">Chats</Link>
          </HStack>
          <HStack spacing="3">
            <Button variant="ghost">Sign in</Button>
            <Button variant="primary">Sign up</Button>
          </HStack>
        </Flex>
      </HStack>
    </Box>
  );
}
