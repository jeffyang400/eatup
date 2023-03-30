import { Box } from '@chakra-ui/react';
import { NextPageContext } from 'next';
import { getSession, signIn, signOut, useSession } from 'next-auth/react';
import Chat from '../components/chat';
import Auth from '../components/auth';
import { Session } from 'next-auth';

export default function Chats() {
  const { data: session } = useSession();

  console.log('session: ', session);

  const reloadSession = async () => {
    const event = new Event('visibilitychange');
    document.dispatchEvent(event);
  };

  return (
    <Box>
      {session?.user?.username ? (
        <Chat session={session}/>
      ) : (
        <Auth session={session} reloadSession={reloadSession} />
      )}
    </Box>
  );
}

export async function getServerSideProps(context: NextPageContext) {
  const session = await getSession(context);

  return {
    props: {
      session,
    },
  };
}
