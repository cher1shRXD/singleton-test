"use client";

import { useStack } from "@cher1shrxd/webview-stack-kit";
import Hi from "./Hi";

const Open = () => {
  const stack = useStack();

  return <button onClick={() => stack.push(Hi, {})}>스택열기</button>;
};

export default Open;
