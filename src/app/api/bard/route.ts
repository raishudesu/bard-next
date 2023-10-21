import { TChatHistory } from "@/types/types";
import Bard from "bard-ai";
import { NextRequest, NextResponse } from "next/server";

const cookie = process.env.NEXT_PUBLIC_BARD_KEY as string;

const bard = new Bard(cookie, {
  verbose: true,
  fetch: fetch,
});

export const POST = async (req: NextRequest) => {
  console.log(process.env.NEXT_PUBLIC_BARD_KEY);
  const { input, chatHistory } = await req.json();
  const bardChat = bard.createChat(chatHistory as TChatHistory);
  console.log(input);
  try {
    const res = await bardChat.ask(input);
    console.log(res);
    return NextResponse.json(
      { res, chats: bardChat.export() },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { msg: "Failed to fetch", error },
      { status: 500 }
    );
  }
};
