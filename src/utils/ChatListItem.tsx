import { Messages } from "@/types";
import S from "@/style/main.module.css";

const renderMessageList = (messages: Messages[]) => {
  return messages.map((msg, index) => {
    if (msg.username === "") {
      return (
        <li className={S.enterUsernickname} key={index}>
          {msg.message}
        </li>
      );
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
