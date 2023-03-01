import { useMutation } from '@apollo/client';
import { Button, Center, Image, Input, Stack, Text } from '@chakra-ui/react';
import { Session } from 'next-auth';
import { signIn } from 'next-auth/react';
import { useState } from 'react';
import UserOperations from '@/graphql/operations/user';
import { CreateUserNameData, CreateUserNameVariables } from '@/util/types';
import { toast } from 'react-hot-toast';

interface IAuthProps {
  session: Session | null;
  reloadSession: () => void;
}

const Auth: React.FunctionComponent<IAuthProps> = ({
  session,
  reloadSession,
}) => {
  const [username, setUsername] = useState('');

  const [createUsername, { loading, error }] = useMutation<
    CreateUserNameData,
    CreateUserNameVariables
  >(UserOperations.Mutations.createUsername);

  const onSubmit = async () => {
    if (!username) return;
    try {
      const {data} = await createUsername({ variables: { username } });

      if (!data?.createUsername) {
        throw new Error('Error creating username');
      }

      if (data.createUsername.error) {
        const {
          createUsername: { error },
        } = data;
        throw new Error(error);
      }

      toast.success('Username created successfully');

      reloadSession();
    } catch (error) {
      toast.error('Error creating username')
      console.log('onSubmit error: ', error);
    }
  };

  return (
    <Center height="100vh">
      <Stack spacing={8} align="center">
        {session ? (
          <>
            <Text fontSize="3xl">Create a Username</Text>
            <Input
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Button width="100%" onClick={onSubmit} isLoading={loading}>
              Save
            </Button>
          </>
        ) : (
          <>
            <Text fontSize="3xl">Eatup</Text>
            <Button
              onClick={() => signIn('google')}
              leftIcon={
                <Image height="20px" src="images/googlelogo.png"></Image>
              }
            >
              Sign In with Google
            </Button>
          </>
        )}
      </Stack>
    </Center>
  );
};

export default Auth;
