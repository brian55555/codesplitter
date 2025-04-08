import { Routes, Route, useRoutes } from "react-router-dom";
import CodeSplitter from "./CodeSplitter";
import routes from "tempo-routes";

function App() {
  return (
    <>
      {/* For the tempo routes */}
      {import.meta.env.VITE_TEMPO && useRoutes(routes)}

      <Routes>
        <Route path="/" element={<CodeSplitter />} />
        {/* Add this before any catchall route */}
        {import.meta.env.VITE_TEMPO && <Route path="/tempobook/*" />}
      </Routes>
    </>
  );
}

export default App;
