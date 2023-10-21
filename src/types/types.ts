export type TChatHistory = {
  conversationID: string;
  responseID: string;
  choiceID: string;
  _reqID: string;
};

export type TConvo = {
  sender: string;
  content: string;
};
