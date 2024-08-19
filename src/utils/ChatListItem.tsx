import { Messages } from "@/types";

const renderMessageList = (messages: Messages[]) => {
  return messages.map((msg, index) => {
    if (msg.username === "") {
      return <li key={index}>{msg.message}</li>;
    } else {
      return (
        <li key={index}>
          {msg.username} : {msg.message}
        </li>
      );
    }
  });
};

export default renderMessageList;
