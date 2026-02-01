"use client";

import { Stack, useStack } from "@cher1shrxd/webview-stack-kit";
import Profile from "./Profile";

const Hi = () => {
  const stack = useStack();

  return (
    <Stack className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-500 via-purple-500 to-pink-500 px-4">
      <div className="bg-white/80 backdrop-blur-md shadow-2xl rounded-3xl p-10 max-w-md w-full flex flex-col items-center">
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 mb-4 animate-fade-in">
          Welcome! 👋
        </h1>
        <p className="text-lg text-gray-700 mb-6 text-center">
          This is a{" "}
          <span className="font-semibold text-purple-600">Next.js</span> test
          app.
          <br />
          Enjoy exploring and customizing your project!
        </p>
        <button
          className="mt-2 px-6 py-2 rounded-full bg-linear-to-r from-blue-500 to-pink-500 text-white font-bold shadow-lg hover:scale-105 transition-transform duration-200"
          onClick={() => stack.push(Profile, { userId: 123 })}>
          Get Started
        </button>
      </div>
      <style jsx>{`
        .animate-fade-in {
          animation: fadeIn 1.2s ease;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </Stack>
  );
};

export default Hi;
