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
import { signIn, signOut, useSession } from 'next-auth/react';

export default function Navbar() {
  const { data: session } = useSession();
  return (
    <Box as="section" height="5vh" borderBottom="1px solid #e8e8e8" px={50} alignItems="center">
      <HStack height="5vh" spacing="10" justify="space-between">
        <Flex justify="space-between" flex="1">
          <HStack spacing="8">
            <Link href="/">Eatup</Link>
            <Link href="/chats">Chats</Link>
          </HStack>
          <HStack spacing="3">
            {session && (
              <ButtonGroup>
                <Button variant="ghost">Profile</Button>
                <Button variant="ghost" onClick={() => signOut()}>
                  Sign out
                </Button>
              </ButtonGroup>
            )}
            {!session && (
              <ButtonGroup>
                <Button variant="ghost" onClick={() => signIn()}>
                  Sign in
                </Button>
                <Button variant="primary" onClick={() => signIn()}>
                  Sign up
                </Button>
              </ButtonGroup>
            )}
          </HStack>
        </Flex>
      </HStack>
    </Box>
  );
}
