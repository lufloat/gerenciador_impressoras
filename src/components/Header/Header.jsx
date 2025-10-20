import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import './Header.css';


export default function Cabecalho() {
  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate();

  const toggleDarkMode = () => {
    setDarkMode((prev) => {
      const newMode = !prev;
      document.body.classList.toggle("dark", newMode);
      return newMode;
    });
  };

  return (
    <header className="header">
      <div className="barra" role="banner"> </div>
      <h1 className="titulo-impressoras">Gerenciador de Impressoras</h1>
      <div className="banner-container">
        <img src="/Imagens/Banner.png" alt="Banner" className="banner" />
      </div>
      <nav className="nav-buttons">
        <button onClick={() => navigate("/impressoras")}> <h1>Impressora</h1>
        </button>
        <button onClick={() => navigate("/pecas")}><h1>Peças</h1>
        </button>
      </nav>
      <div className="header-right">
        {/* Alternar Modo Escuro - Agora com classe active no container para feedback visual */}
        <div
          className={`toggle ${darkMode ? "active" : ""}`}
          onClick={toggleDarkMode}
          style={{ cursor: "pointer" }}
        >
          <div className={`toggle-btn ${darkMode ? "active" : ""}`}></div>
          <span className="icon-moon"></span> {/* Adicionei um emoji simples de lua como placeholder; substitua por ícone real se quiser */}
        </div>
        {/* Logotipo */}
        <img src="/logo.png" alt="Logo" className="logo" />
      </div>
    </header>
  );
}