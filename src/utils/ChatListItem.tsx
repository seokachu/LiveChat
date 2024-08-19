import { Messages } from "@/types";

const renderMessageList = (messages: Messages[]) => {
  return messages.map((msg, index) => (
    <li key={index}>
      {msg.username} : {msg.message}
    </li>
  ));
};

export default renderMessageList;
