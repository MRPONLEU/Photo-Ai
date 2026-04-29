export const generateImage = async (
  prompt: string, 
  aspectRatio: "1:1" | "3:4" | "4:3" | "9:16" | "16:9" = "1:1",
  images: string[] = [] // array of base64 strings
) => {
  const customApiKey = localStorage.getItem('gemini_api_key');
  const response = await fetch("/api/generate-image", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ prompt, aspectRatio, images, apiKey: customApiKey }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    if (errorData?.error === "QUOTA_EXCEEDED" || response.status === 429) {
      throw new Error("QUOTA_EXCEEDED");
    }
    throw new Error(errorData?.error || "Failed to generate image");
  }

  const data = await response.json();
  if (data.image) {
    return data.image; // data:image/...;base64,...
  }
  throw new Error("No image generated");
};

