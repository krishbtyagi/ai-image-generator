"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Wand2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateImage = async () => {
    if (!prompt) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate image");
      }
      

      setImage(data.imageUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">AI Image Generator</h1>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Transform your ideas into stunning images using artificial intelligence. Simply describe what you want to see, and watch the magic happen.
          </p>
        </div>

        <Card className="p-6 bg-gray-800/50 border-gray-700">
          <div className="space-y-4">
            <Textarea
              placeholder="Describe the image you want to generate..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="min-h-[100px] bg-gray-900 border-gray-700 text-white"
            />
            <Button
              onClick={generateImage}
              disabled={loading || !prompt}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Generating...
                </div>
              ) : (
                <div className="flex items-center">
                  <Wand2 className="mr-2 h-4 w-4" />
                  Generate Image
                </div>
              )}
            </Button>
          </div>
        </Card>

        {error && (
          <div className="text-red-500 bg-red-500/10 p-4 rounded-lg text-center">
            {error}
          </div>
        )}

{image && (
  <Card className="p-4 bg-gray-800/50 border-gray-700">
    <img
      src={image}
      alt="Generated image"
      className="rounded-lg w-full"
      style={{ maxHeight: "512px", objectFit: "contain" }}
    />
  </Card>
)}
      </div>
    </div>
  );
}