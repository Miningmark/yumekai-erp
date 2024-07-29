import ipLookup from "@/utils/ipLookup";
import { useState } from "react";

export default function IPTest() {
  const [ipAddress, setIpAddress] = useState("");
  const [response, setResponse] = useState({ country: "", region: "" });

  async function handleSubmit() {
    setResponse(await ipLookup(ipAddress));
  }

  return (
    <div>
      <input type="text" value={ipAddress} onChange={(e) => setIpAddress(e.target.value)} />
      <button onClick={handleSubmit}>Submit</button>
      <p>{`Land: ${response.country}`}</p>
      <p>{`Region: ${response.region}`}</p>
    </div>
  );
}
