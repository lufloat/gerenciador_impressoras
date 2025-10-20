import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header/Header";
import Impressora from "./components/pages/Impressoras/impressoras";
import Pecas from "./components/pages/Pecas/Pecas";
import Footer from "./components/Footer/Footer";

function App() {
  return (
    <Router>  
      <Header />
      <main>
        <Routes>
          <Route path="/impressoras" element={<Impressora />} />
          <Route path="/pecas" element={<Pecas />} />
          <Route path="*" element={<Impressora />} /> {/* rota padrão */}
        </Routes>
      </main>
      <footer>
        <Footer></Footer>
      </footer>
    </Router>
  );
}
export default App;
