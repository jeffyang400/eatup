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
import Image from 'next/image';

export default function Navbar() {
  const { data: session } = useSession();
  return (
    <Box
      as="section"
      height="3rem"
      borderBottom="1px solid #e8e8e8"
      px={50}
      alignItems="center"
      backgroundColor="#faf2e4"
    >
      <HStack height="3rem" spacing="10" justify="space-between">
        <Flex justify="space-between" flex="1">
          <HStack spacing="8">
            <Link href="/">
              <Image
                src="/images/logo.png"
                alt="Logo"
                width={100}
                height={50}
              />
            </Link>
            <Link href="/chats">Chats</Link>
          </HStack>
          <HStack spacing="3">
            {session && (
              <ButtonGroup>
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
