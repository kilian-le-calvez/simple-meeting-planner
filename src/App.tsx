// App.tsx
import React, { useState } from "react";
import AppContent from "./AppContent";

export type ValidPassword = "sparta" | "tennis";

const App: React.FC = () => {
  const [password, setPassword] = useState<string>("");

  if (password !== "sparta" && password !== "tennis") {
    return (
      <div className="w-screen min-h-screen flex flex-col justify-center items-center p-8">
        <h1 className="text-2xl font-bold mb-4">🔒 Accès restreint</h1>
        <input
          type="password"
          placeholder="Entrez le mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 rounded mb-4"
        />
        <button
          onClick={() => {
            if (password === "sparta" || password === "tennis") {
              setPassword(password);
            } else {
              alert("Mot de passe incorrect.");
              setPassword("");
            }
          }}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Valider
        </button>
      </div>
    );
  }
  return <AppContent password={password}></AppContent>;
};

export default App;
