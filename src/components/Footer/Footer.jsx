import React, { useState, useEffect } from "react";  // Adicionado: useState e useEffect para o relógio
import "./Footer.css";  // Seu CSS (ajuste se o arquivo for diferente)
function Footer() {  // PascalCase mantido
  const currentYear = new Date().getFullYear();  // Ano dinâmico mantido
  const [horaAtual, setHoraAtual] = useState(new Date().toLocaleTimeString());  // Estado para a hora (inicia com a hora atual)
  // useEffect para atualizar a hora a cada segundo
  useEffect(() => {
    const intervalId = setInterval(() => {
      setHoraAtual(new Date().toLocaleTimeString());  // Atualiza a hora no formato local (HH:MM:SS)
    }, 1000);  // Executa a cada 1000ms (1 segundo)
    // Limpa o intervalo quando o componente for desmontado (boa prática para evitar vazamentos de memória)
    return () => clearInterval(intervalId);
  }, []);  // Array vazio: executa só uma vez ao montar o componente
  return (
    <footer role="contentinfo" className="footer-main">  {/* role e classe mantidos */}
      <p className="text-footer">  {/* <p> mantido para semântica */}
        © {currentYear} Grupo Odilon Santos | Hora atual: <span className="hora-atual">{horaAtual}</span>  {/* Adicionado: relógio com classe para CSS */}
      </p>
    </footer>
  );
}
export default Footer;  // Export mantido
