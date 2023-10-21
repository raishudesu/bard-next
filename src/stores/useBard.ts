export const useBard = async (input: string, history: object | null) => {
  const res = await fetch("/api/bard", {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({
      input,
      chatHistory: history,
    }),
  });
  const data = await res.json();
  return data;
};
