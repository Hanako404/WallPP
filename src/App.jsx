
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function App() {
  const [tag, setTag] = useState("naruto");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [recommended, setRecommended] = useState([]);

  useEffect(() => {
    const savedMode = localStorage.getItem("darkMode");
    if (savedMode) setDarkMode(savedMode === "true");

    const savedTag = localStorage.getItem("lastTag");
    if (savedTag) setTag(savedTag);

    const savedRecommendations = JSON.parse(localStorage.getItem("recommendations")) || [];
    setRecommended(savedRecommendations);
  }, []);

  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  const generateImage = async () => {
    setLoading(true);
    try {
      const res = await fetch(`https://api.waifu.pics/sfw/${tag}`);
      const data = await res.json();
      setImageUrl(data.url);
      localStorage.setItem("lastTag", tag);

      const updatedRecommendations = [data.url, ...recommended].slice(0, 5);
      setRecommended(updatedRecommendations);
      localStorage.setItem("recommendations", JSON.stringify(updatedRecommendations));
    } catch (err) {
      console.error("Error fetching image:", err);
      setImageUrl("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={\`\${darkMode ? "bg-black text-white" : "bg-gray-100 text-gray-900"} min-h-screen transition-colors font-sans\`}>      
      <div className="flex items-center justify-between p-4 bg-red-900 text-white">
        <h1 className="text-2xl font-bold">404 Gallery</h1>
        <button onClick={() => setMenuOpen(!menuOpen)} className="text-white text-xl">☰</button>
      </div>

      {menuOpen && (
        <div className="bg-red-800 text-white p-4 flex flex-col gap-2">
          <button onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
          </button>
          <span>More features coming soon...</span>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-semibold mb-4">Find your next anime wallpaper</h2>
          <div className="flex gap-4 justify-center items-center">
            <input
              className="w-1/2 p-2 rounded border border-gray-300"
              value={tag}
              onChange={(e) => setTag(e.target.value.toLowerCase())}
              placeholder="Enter anime tag..."
            />
            <button onClick={generateImage} disabled={loading} className="bg-red-700 text-white px-4 py-2 rounded">
              {loading ? "Loading..." : "Generate"}
            </button>
          </div>
        </div>

        {imageUrl && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-center mb-8">
            <div className="w-full max-w-xl overflow-hidden shadow-lg">
              <img src={imageUrl} alt="Anime Wallpaper" className="w-full rounded" />
              <a href={imageUrl} download className="block text-center bg-black text-white py-2 hover:bg-gray-800">
                Download
              </a>
            </div>
          </motion.div>
        )}

        {recommended.length > 0 && (
          <div className="mt-10">
            <h3 className="text-2xl font-semibold mb-4">Recommended for You</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {recommended.map((img, idx) => (
                <div key={idx} className="overflow-hidden rounded shadow">
                  <img src={img} alt={\`Recommendation \${idx}\`} className="w-full" />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
      }
    
