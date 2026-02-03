"use client";

import { useState, useRef } from "react";
import { Stack } from "@cher1shrxd/webview-stack-kit";
import { useBridge, useBridgeEvent } from "@/hooks/useBridge";

const Camera = () => {
  const [photo, setPhoto] = useState<{ uri?: string; base64?: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { requestCamera, postMessage } = useBridge();

  // Listen for camera photo from native
  useBridgeEvent("CAMERA_PHOTO", (data: { uri?: string; base64?: string }) => {
    setPhoto(data);
    setLoading(false);
  });

  // Listen for camera errors
  useBridgeEvent("CAMERA_ERROR", (data: { error: string }) => {
    alert(data.error || "카메라 오류가 발생했습니다.");
    setLoading(false);
  });

  const handleCameraRequest = () => {
    setLoading(true);
    // Request camera from native app
    requestCamera();
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        const photoData = {
          uri: URL.createObjectURL(file),
          base64: base64.split(",")[1], // Remove data:image/...;base64, prefix
        };
        setPhoto(photoData);
        
        // Send photo data back via bridge (for testing)
        postMessage({
          type: "CAMERA_PHOTO",
          data: photoData,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleWebFallback = () => {
    // Fallback for web: use file input
    fileInputRef.current?.click();
  };

  return (
    <Stack className="min-h-screen flex flex-col items-center justify-center bg-linear-to-br from-indigo-500 via-purple-500 to-pink-500 p-4">
      <div className="bg-white/90 backdrop-blur-lg shadow-2xl rounded-3xl p-8 max-w-md w-full">
        <h1 className="text-3xl font-bold text-center mb-6 bg-clip-text text-transparent bg-linear-to-r from-indigo-600 to-pink-600">
          📷 Camera Bridge
        </h1>

        {photo ? (
          <div className="mb-6">
            <img
              src={photo.uri || `data:image/jpeg;base64,${photo.base64}`}
              alt="Captured"
              className="w-full rounded-lg shadow-lg mb-4"
            />
            <button
              onClick={() => setPhoto(null)}
              className="w-full px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-lg transition-colors"
            >
              다시 촬영
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <button
              onClick={handleCameraRequest}
              disabled={loading}
              className={`w-full px-6 py-3 bg-linear-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-semibold rounded-lg shadow-lg transition-all ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "대기 중..." : "네이티브 카메라 열기"}
            </button>

            <button
              onClick={handleWebFallback}
              className="w-full px-6 py-3 bg-linear-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-semibold rounded-lg shadow-lg transition-all"
            >
              웹 파일 선택 (대체)
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>
        )}

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold text-blue-900 mb-2">💡 사용 방법</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• 네이티브 앱: &quot;네이티브 카메라 열기&quot;</li>
            <li>• 웹 환경: &quot;웹 파일 선택&quot;</li>
            <li>• Bridge가 자동으로 메시지 전달</li>
          </ul>
        </div>
      </div>
    </Stack>
  );
};

export default Camera;
