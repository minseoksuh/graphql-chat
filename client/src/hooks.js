import {
  messagesQuery,
  addMessageMutation,
  messageAddedSubscription,
} from "./graphql/queries";
import { useQuery, useMutation, useSubscription } from "@apollo/react-hooks";

export function useChatMessages() {
  const { data } = useQuery(messagesQuery);
  const messages = data ? data.messages : [];
  useSubscription(messageAddedSubscription, {
    onSubscriptionData: ({ client, subscriptionData }) => {
      console.log(subscriptionData.data.messageAdded);
      client.writeQuery({
        query: messagesQuery,
        data: { messages: messages.concat(subscriptionData.data.messageAdded) },
      });
    },
  });
  const [addMessage] = useMutation(addMessageMutation);

  return {
    messages,
    addMessage: (text) => {
      addMessage({ variables: { input: { text } } });
    },
  };
}
