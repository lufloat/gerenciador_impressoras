import React, { useEffect, useState, useRef } from "react";
import "./impressoras.css";
import { FaTimes, FaPlay, FaPause } from "react-icons/fa";
/**
Props:
- materialName (string) ex: "Alavanca"
- totalSeconds (number) tempo total de impressão em segundos (ex: 7200 para 2h)
- startRunning (bool) opcional: começa em execução
- simulationGifUrl (string): URL do GIF para simulação da impressora (tempo real)
- staticImageUrl (string): URL da imagem estática (padrão: uma imagem placeholder)
*/
export default function Impressoras({
  materialName = "peça A",
  totalSeconds = 7200,
  startRunning = true,
  simulationGifUrl = "http://192.168.148.250:8080/?action=stream", // URL do GIF de simulação (tempo real)
  staticImageUrl = "/Imagens/icones/impressora.png",
}) {

  const [remaining, setRemaining] = useState(totalSeconds);
  const [isRunning, setIsRunning] = useState(Boolean(startRunning));
  const [showGif, setShowGif] = useState(false); // Novo estado para controlar se mostra GIF ou imagem estática
  const [gifSrc, setGifSrc] = useState(simulationGifUrl); // Estado para forçar reload do GIF com cache-buster
  const intervalRef = useRef(null);
  const remainingRef = useRef(remaining);
  const preloadRef = useRef(new Image()); // Para pré-carregar o GIF em background

  // Sincroniza a ref com o estado remaining
  useEffect(() => {
    remainingRef.current = remaining;
  }, [remaining]);
  // Pré-carrega o GIF para garantir animação suave (roda uma vez ao montar)
  useEffect(() => {
    preloadRef.current.src = simulationGifUrl; // Carrega invisível, pronto para usar
    preloadRef.current.onload = () => {
      console.log("GIF pré-carregado com sucesso"); // Opcional: ver no console
    };
    preloadRef.current.onerror = () => {
      console.log("Erro no pré-carregamento do GIF");
    };
  }, [simulationGifUrl]);

  // Formata segundos em "Hh Mm" ou "Xm Ys"
  const formatTime = (s) => {
    const hrs = Math.floor(s / 3600);
    const mins = Math.floor((s % 3600) / 60);
    const secs = s % 60;
    if (hrs > 0) return `${hrs}h ${mins}m`;
    if (mins > 0) return `${mins}m ${secs}s`;
    return `${secs}s`;
  };
  // Progresso 0..1 (definido aqui para garantir escopo no JSX)
  const progress = Math.max(0, Math.min(1, (totalSeconds - remaining) / totalSeconds));

  // Timer
  useEffect(() => {
    if (isRunning && remainingRef.current > 0) {
      intervalRef.current = setInterval(() => {
        setRemaining((r) => {
          if (r <= 1) {
            clearInterval(intervalRef.current);
            setIsRunning(false);
            return 0;
          }
          return r - 1;
        });
      }, 1000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning]);

  // Função para mostrar o GIF (ao passar o mouse ou tocar) - simula visualização do tempo real
  const handleShowGif = () => {
    if (isRunning) { // Só mostra se o processo estiver rodando
      // Força reload do GIF com cache-buster (timestamp) para animação fresca
      setGifSrc(`${simulationGifUrl}?t=${Date.now()}`);
      setShowGif(true);
    }
  };
  // Função para esconder o GIF (ao sair do mouse ou soltar o toque) - "pausa" visual, mas timer continua
  const handleHideGif = () => {
    setShowGif(false);
    // Reseta o src para o original (sem cache-buster) para próxima vez
    setGifSrc(simulationGifUrl);

  };
  // Handler para erro no carregamento do GIF (fallback para imagem estática)
  const handleGifError = () => {
    console.log("Erro ao carregar GIF, usando imagem estática como fallback");
    setShowGif(false); // Volta para estática se GIF falhar
  };
  // Botões (mantidos iguais, sem mudanças)
  const handlePause = () => setIsRunning(false);
  const handleContinue = () => {
    if (remaining > 0) setIsRunning(true);
  };
  const handleCancel = () => {
    setIsRunning(false);
    setRemaining(totalSeconds);
    setShowGif(false); // Volta para a imagem estática ao cancelar
    setGifSrc(simulationGifUrl); // Reseta o GIF
  };

  return (
    <div className="impressora-card">
      <div className="left-panel">
        <h1 className="View_Print" >Passe o mouse para ver</h1>
        <div className="printer-illustration">
          {/* Condicional: mostra imagem estática ou GIF baseado em showGif */}
          {showGif ? (
            // Modo GIF (visível ao interagir - simula tempo real, com cache-buster para animação)
            <img
              src={gifSrc} // Usa o src dinâmico para forçar animação
              alt="Animação em tempo real da impressora"
              className="gif-simulacao" // Classe para estilização (adicione no CSS se necessário)
              onError={handleGifError} // Fallback se GIF não carregar
              onMouseLeave={handleHideGif} // Esconde ao sair do mouse (desktop)
              onTouchEnd={handleHideGif} // Esconde ao soltar o toque (mobile)
            />
          ) : (
            // Modo imagem estática (padrão)
            <img
              src={staticImageUrl}
              alt="Imagem da impressora"
              className="imagem-estatica" // Adicione uma classe CSS para estilizar a imagem estática (mesmo tamanho que o GIF)
              onMouseEnter={handleShowGif} // Mostra GIF ao passar o mouse (desktop)
              onTouchStart={handleShowGif} // Mostra GIF ao tocar (mobile)
              style={{ cursor: 'pointer' }} // Cursor pointer para indicar interatividade
            />
          )}

        </div>
        <div className="button-column">
          <button className="pill pill-cancel" onClick={handleCancel}>
            <FaTimes className="icon" /> Cancelar
          </button>
          <button className="pill pill-continue" onClick={handleContinue} disabled={!isRunning}>
            <FaPlay className="icon" /> Continuar
          </button>
          <button className="pill pill-pause" onClick={handlePause} disabled={!isRunning}>
            <FaPause className="icon" /> Pausar
          </button>
        </div>
      </div>

      <div className="live_print_info">
        <div className="title">
          <h1>Impressão:</h1> {/* "Impressão:" em uma linha separada */}
          <span className="Strong">{materialName}</span> {/* "peça A" (ou valor) abaixo, em linha separada */}
        </div>
        <div className="time-row">
          <span className="time-text">{formatTime(remaining)}restantes</span>
          <div className="progress-wrap">
            <div className="progress-track">
              <div
                className="progress-fill"
                style={{ width: `${progress * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}