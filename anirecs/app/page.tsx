"use client"

import { useState } from "react";
import Cards from "@/components/Cards";

export default function Home() {
  const[username, setUsername] = useState("");
  const[recommendations, setRecommendations] = useState([]);
  const[image, setImage] = useState([]);

  async function handleSubmit() {
    // we need to grab whats in input field then extract as string
    // then send to route.ts for finduser function, which triggers everything else..
    const res = await fetch('/api/anirec', {
      method: "POST",
      body: JSON.stringify({username: username})
    })

    const result = await res.json();
    setRecommendations(JSON.parse(result.recommendations));

    console.log(result)
  }

  return (
    <div className="flex flex-col flex-1 items-center justify-start pt-20 bg-zinc-50 font-sans dark:bg-black">
      <h1 className="text-4xl text-white text-center font-bold">ani<span className="text-4xl text-emerald-500 font-bold">recs.</span></h1>
      
      <div className="flex flex-row gap-2 mt-8">
        <input 
          className="px-5 py-1 bg-gray-200 rounded-md text-black"
          placeholder="enter anilist username here"
          value={username}
          onChange={(e)=>
            setUsername(e.target.value)
          }
        />
        <button 
          className="px-3 py-2 bg-teal-500 rounded-md text-white font-light"
          onClick={handleSubmit}
        >GO</button>
      </div>

      <div className="grid grid-cols-5">
          {recommendations.map((rec) => (
              <Cards key={rec} title={rec} />
          ))}
      </div>
      
    </div>
  );
}
