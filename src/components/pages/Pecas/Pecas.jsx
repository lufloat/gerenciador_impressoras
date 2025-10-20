import React, { useState } from "react";
import "./Pecas.css";
import * as XLSX from "xlsx"; // Importa a biblioteca XLSX

function ListaPecas() {
  const [pecas, setPecas] = useState([""]);
  const [novaPeca, setNovaPeca] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [termoBusca, setTermoBusca] = useState("");

  // --- FUNÇÃO ADICIONAR PEÇA ---
  const adicionarPeca = () => {
    if (novaPeca.trim() === "") {
      setMensagem("Por favor, digite o nome de uma peça.");
      return;
    }
    if (pecas.includes(novaPeca.trim())) {
      setMensagem("Essa peça já existe na lista.");
      return;
    }
    setPecas([...pecas, novaPeca.trim()]);
    setNovaPeca("");
    setMensagem(""); // Limpa a mensagem de erro se a adição for bem-sucedida
  };







  // --- FUNÇÃO EXCLUIR PEÇA ---
  const excluirPeca = (pecaParaExcluir) => {
    const novasPecas = pecas.filter(peca => peca !== pecaParaExcluir);
    setPecas(novasPecas);
    setMensagem(""); // Limpa a mensagem caso alguma ação anterior a tenha definido
  };

  // --- FUNÇÃO PARA IMPORTAR PEÇAS DE ARQUIVO EXCEL ---
  const importarPecas = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (evt) => {
      const bstr = evt.target.result;
      const workbook = XLSX.read(bstr, { type: "binary" });

      // Vamos assumir que as peças estão na primeira planilha e na primeira coluna
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];

      // Converte a planilha para JSON, onde cada linha é um array
      const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      const pecasImportadas = [];
      for (const row of data) {
        const nomePeca = row[0]; // Pega o valor da primeira coluna
        if (typeof nomePeca === "string" && nomePeca.trim() !== "") {
          // Verifica se não é duplicata antes de adicionar
          if (!pecas.includes(nomePeca.trim()) && !pecasImportadas.includes(nomePeca.trim())) {
            pecasImportadas.push(nomePeca.trim());
          }
        }
      }

      if (pecasImportadas.length > 0) {
        setPecas((prev) => [...prev, ...pecasImportadas]);
        setMensagem(`Importadas ${pecasImportadas.length} novas peças.`);
      } else {
        setMensagem("Nenhuma peça nova encontrada ou todas já existem.");
      }
    };

    reader.onerror = () => {
      setMensagem("Erro ao ler o arquivo.");
    };

    reader.readAsBinaryString(file);
  };

  // Função para filtrar as peças com base no termo de busca
  const pecasFiltradas = pecas.filter(peca =>
    peca.toUpperCase().includes(termoBusca.toUpperCase())
  );

  return (
    <div className="lista-pecas-container">
      <h1 className="titulo-lista">Lista de Peças</h1>

      {/* Input para adicionar peça */}
      <div className="input-adicionar">
        <input
          type="text"
          placeholder="Digite o nome da peça"
          value={novaPeca}
          onChange={(e) => setNovaPeca(e.target.value)}
          className="input-peca"
          onKeyPress={(e) => { // Adicionado para permitir adicionar com Enter
            if (e.key === 'Enter') {
              adicionarPeca();
            }
          }}
        />
        <button onClick={adicionarPeca} className="botao-adicionar">Adicionar peça</button>
      </div>

      {/* Input para importar peças de arquivo Excel */}
      <div className="input-importar">
        <label htmlFor="file-upload" className="custom-file-upload">
          Importar
        </label>
        <input
          id="file-upload"
          type="file"
          accept=".xlsx, .xls"
          onChange={importarPecas}
          style={{ display: 'none' }} // Esconde o input padrão
        />
      </div>


      {/* Campo de busca */}
      <div className="campo-busca">
        <input
          type="text"
          placeholder="Buscar peça..."
          value={termoBusca}
          onChange={(e) => setTermoBusca(e.target.value)}
          className="input-busca"
        />
      </div>

      {mensagem && <p className="mensagem-erro">{mensagem}</p>}

      {/* Lista das peças (agora usa pecasFiltradas) */}
      <ul className="lista-de-pecas">
        {pecasFiltradas.map((peca, index) => (
          <li key={index} className="item-lista">
            <span className="nome-peca">{peca}</span>
            <button onClick={() => excluirPeca(peca)} className="botao-excluir">
              Excluir
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ListaPecas;