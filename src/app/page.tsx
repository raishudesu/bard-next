"use client";

import { useRef, useState } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import { useBard } from "@/stores/useBard";
import { TConvo } from "@/types/types";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dark, atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";

export default function Home() {
  const syntaxHighlighterRef = useRef<SyntaxHighlighter | null>(null);

  const [chatHistory, setChatHistory] = useState({});
  const [input, setInput] = useState("");
  const [convo, setConvo] = useState<TConvo[]>([]);
  const [loading, setLoading] = useState(false);

  const GetBardResponse = async () => {
    setInput("");
    const userQuery = [{ sender: "user", content: input }];
    setConvo([...convo, ...userQuery]);
    setLoading(true);
    const res = await useBard(input, chatHistory);
    const bardResponse = [{ sender: "bard", content: res.res }];
    setChatHistory(res.chats);
    setConvo([...convo, ...userQuery, ...bardResponse]);
    setLoading(false);
  };

  const senderType = (sender: string) => {
    if (sender === "user") return "self-end";
    return "self-start";
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 bg-[#242424] ">
      <div className="text-[#f0f0f0] w-full max-w-screen-lg flex flex-col gap-6">
        {convo.map(({ sender, content }, index) => (
          <Markdown
            className={`${senderType(sender)} bg-slate-500 p-3`}
            key={index}
            components={{
              code(props) {
                const { children, className, node, ...rest } = props;
                const match = /language-(\w+)/.exec(className || "");
                return match ? (
                  <SyntaxHighlighter
                    {...rest}
                    style={atomDark}
                    language={match[1]}
                    PreTag="div"
                    ref={(node) => (syntaxHighlighterRef.current = node)}
                  >
                    {String(children).replace(/\n$/, "")}
                  </SyntaxHighlighter>
                ) : (
                  <code {...rest} className={className}>
                    {children}
                  </code>
                );
              },
            }}
          >
            {content}
          </Markdown>
        ))}
        {loading && <div className="self-start">Loading...</div>}
      </div>
      <div className="flex gap-2">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="text-black rounded-lg"
        />
        <button
          onClick={GetBardResponse}
          className="text-white bg-blue-400 p-3 rounded-lg"
        >
          Send
        </button>
      </div>
    </main>
  );
}
