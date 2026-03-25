import React, { useState } from 'react';
import { Image as ImageIcon, Download, Sparkles } from 'lucide-react';

const HF_TOKEN = import.meta.env.VITE_HF_TOKEN;

function ImageComponent({ images, setImages }) {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerateImage = async (e) => {
    e?.preventDefault();
    if (!prompt.trim() || isLoading) return;

    const currentPrompt = prompt.trim();
    setPrompt('');
    setIsLoading(true);

    try {
      const response = await fetch(
        'https://router.huggingface.co/hf-inference/models/stabilityai/stable-diffusion-xl-base-1.0',
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${HF_TOKEN}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ inputs: currentPrompt }),
        }
      );

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          throw new Error('Authentication Error (401): The Hugging Face token is invalid. Make sure to use a Hugging Face token (starts with hf_...) instead of your OpenRouter key.');
        }
        throw new Error(`Hugging Face API Error: ${response.status}`);
      }
      const blob = await response.blob();
      const imageUrl = URL.createObjectURL(blob);

      setImages((prev) => [{ url: imageUrl, prompt: currentPrompt, id: Date.now() }, ...prev]);
    } catch (error) {
      console.error(error);
      alert(`Error generating image: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="image-layout h-full flex-col">
      <div className="image-gen-header">
        <h2>AI Image Workshop</h2>
        <p>Transform your ideas into stunning visual art.</p>
        <form className="image-input-container" onSubmit={handleGenerateImage}>
          <input
            type="text"
            placeholder="Describe what you want to see (e.g. A cyberpunk city at dusk)..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
          <button type="submit" className="action-btn primary action-btn-wide" disabled={isLoading || !prompt.trim()}>
            {isLoading ? (
              <><div className="spinner"></div> Generating...</>
            ) : (
              <>Generate <Sparkles size={18} style={{ marginLeft: '6px' }} /></>
            )}
          </button>
        </form>
      </div>

      <div className="image-results-container">
        {images.length === 0 && !isLoading && (
          <div className="empty-state">
            <ImageIcon size={48} color="var(--text-secondary)" style={{ marginBottom: '1rem', opacity: 0.5 }} />
            <p>Your creative masterpieces will appear here.</p>
          </div>
        )}
        {(images.length > 0 || isLoading) && (
          <div className="image-grid">
            {isLoading && (
              <div className="image-card placeholder-card">
                <div className="spinner big-spinner"></div>
                <p>Creating artwork...</p>
              </div>
            )}
            {images.map((img) => (
              <div key={img.id} className="image-card fade-in">
                <img src={img.url} alt={img.prompt} className="generated-image" loading="lazy" />
                <div className="image-card-overlay">
                  <p className="image-prompt-text">{img.prompt}</p>
                  <a href={img.url} download={`ai-image-${img.id}.png`} className="download-btn" title="Download Image">
                    <Download size={18} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ImageComponent;
