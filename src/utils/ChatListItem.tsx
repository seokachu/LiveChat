import { Messages } from "@/types";
import S from "@/style/main.module.css";

const renderMessageList = (messages: Messages[], currentUser: string) => {
  return messages.map((msg, index) => {
    const isCurrentUser = msg.username === currentUser;

    if (msg.username === "") {
      return (
        <li className={S.enterUserNickname} key={index}>
          {msg.message}
        </li>
      );
    } else {
      return (
        <li
          className={`${S.messageItem} ${isCurrentUser ? S.right : S.left}`}
          key={index}
        >
          <p className={S.nickname}>{msg.username}</p>
          <p className={S.message}> {msg.message}</p>
        </li>
      );
    }
  });
};

export default renderMessageList;
