import { GoogleGenAI } from "@google/genai";

export async function POST(request: Request) {
    const body = await request.json();
    const username = body.username;
    const isValid = await findUser(username);
    if (!isValid) return;
    const list = await getUserList(username);
    const filtered = filterList(list);
    const titles =filtered.map(e => e.media.title.english);
    
    const recommendations = await main(titles);
    return Response.json({ recommendations });
}


async function findUser(username: String) {
    const query=`
        query($name: String) {
            User(name: $name) {
            name
            }    
        }
    `;

    const res = await fetch('https://graphql.anilist.co',{
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            query: query,
            variables: { name: username }
        })
    })
    
    const result = await res.json();
    
    if(result.data.User) {
        return true;
    } else { 
        return false;
    }
}

async function getUserList(username: String) {
    const query=`
        query ($type: MediaType!, $userName: String!) {
            MediaListCollection(type: $type, userName: $userName) {
                lists {
                    name
                    entries {
                        id
                        score
                        media {
                            id
                            title {
                                romaji
                                english
                            }
                        }
                    }
                }
            }
        }
    `;
    const res = await fetch('https://graphql.anilist.co',{
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            query: query,
            variables: {
                type: "ANIME", 
                userName: username 
            }
        })
    })
    
    const result = await res.json();
    
    if(result.data.MediaListCollection.lists) {
        return result.data.MediaListCollection.lists;
    } else { 
        return false;
    }


}

function filterList(list) {
    return list.flatMap((e => e.entries)).filter(e => e.score >= 7);
} 

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function main(titles) {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Based on these anime the user rated 7 or above: ${titles.join(", ")}. Recommend 5 anime they haven't seen. Return only a JSON array of title strings.`
  });
  console.log(response.text);
  return response.text;
}