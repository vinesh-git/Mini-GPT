import { useState } from 'react'
import './App.css'

function App() {
  const [prompt, setPrompt] = useState("");
  const [loading,setLoading] = useState(false);
  const [response,setResponse] = useState("");

  const sendPrompt = async () => {
    setResponse("");
    setLoading(true);

    const res = await fetch("http://localhost:3000/chat",{
      method: "POST",
      headers : {
        "Content-Type" : "application/json"
      },
      body : JSON.stringify({prompt})
    });

    if(!res.body)
      throw new Error("Readable stream not supported");

    const reader = res.body?.getReader();
    const decoder = new TextDecoder("utf-8");

    while(true){
      const {value, done} = await reader?.read();
      if(done) break;
      
      const chunk = decoder.decode(value);
      setResponse(prev => prev+chunk);
    }
    
    setLoading(false);
  }

  return (
    <>
      <h1>Mini-GPT</h1>
      <textarea
        rows={8}
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder='Ask Something...'
        style={{width : "100%"}}
        />
        <button onClick={sendPrompt} disabled = {loading}>{loading ? "Thinking..." : "Send"}</button>
        <pre style={{whiteSpace : "pre-wrap", marginTop : 20}}>{response}</pre>
    </>
  )
}

export default App
