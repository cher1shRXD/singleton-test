"use client";

import { Stack, useStack } from "@cher1shrxd/webview-stack-kit";
import Camera from "./Camera";

const Profile = () => {
  const stack = useStack();

  return (
    <Stack className="min-h-screen flex items-center justify-center bg-linear-to-tr from-pink-400 via-purple-400 to-blue-400 px-4">
      <div className="bg-white/90 backdrop-blur-lg shadow-xl rounded-2xl p-8 max-w-sm w-full flex flex-col items-center">
        <div className="w-24 h-24 rounded-full bg-linear-to-br from-blue-400 via-purple-400 to-pink-400 flex items-center justify-center mb-4 shadow-lg">
          <span className="text-4xl">🧑‍💻</span>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">User Profile</h2>
        <p className="text-gray-600 mb-4 text-center">
          Welcome to your profile page!
          <br />
          Here you can manage your information and settings.
        </p>
        <div className="flex gap-3 w-full">
          <button className="flex-1 px-5 py-2 rounded-full bg-linear-to-r from-purple-500 to-pink-500 text-white font-semibold shadow-md hover:scale-105 transition-transform duration-200">
            Edit Profile
          </button>
          <button 
            onClick={() => stack.push(Camera, {})}
            className="flex-1 px-5 py-2 rounded-full bg-linear-to-r from-indigo-500 to-purple-500 text-white font-semibold shadow-md hover:scale-105 transition-transform duration-200">
            📷 Camera
          </button>
        </div>
      </div>
    </Stack>
  );
};

export default Profile;
