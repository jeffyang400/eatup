// USERS
export interface CreateUserNameData {
  createUsername: { success: boolean; error: string };
}

export interface CreateUserNameVariables {
  username: string;
}

export interface SearchUsersInput {
  username: string;
}

export interface SearchUsersData {
  searchUsers: Array<SearchedUser>;
}

export interface SearchedUser {
  id: string;
  username: string;
}

// CONVERSATIONS
export interface CreateConversationData {
  createConversation: { conversationId: string };
}

export interface CreateConversationInput {
  participantIds: Array<string>;
}
