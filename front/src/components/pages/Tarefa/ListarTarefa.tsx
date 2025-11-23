import React, { useEffect, useState } from "react";
import axios from "axios";
import "./ListarTarefa.css";

interface TarefaDTO {
  id: number;
  nome: string;
  descricao: string;
  nomeComodo: string;
}

interface MoradorDTO {
  id: number;
  nome: string;
}

function ListarTarefas() {
  const [tarefas, setTarefas] = useState<TarefaDTO[]>([]);
  const [moradores, setMoradores] = useState<MoradorDTO[]>([]);
  const [moradorSelecionado, setMoradorSelecionado] = useState<{ [key: number]: number }>({});

  useEffect(() => {
    carregarTarefas();
    carregarMoradores();
  }, []);

  async function carregarTarefas() {
    try {
      const resposta = await axios.get("http://localhost:5047/listar/tarefas");
      setTarefas(resposta.data);
    } catch {
      console.log("Erro ao carregar tarefas!");
    }
  }

  async function carregarMoradores() {
    try {
      const resposta = await axios.get("http://localhost:5047/listar/moradores");
      setMoradores(resposta.data);
    } catch {
      console.log("Erro ao carregar moradores!");
    }
  }

  async function concluirTarefa(idTarefa: number) {
    const idMorador = moradorSelecionado[idTarefa];

    if (!idMorador || idMorador === 0) {
      alert("Selecione um morador para concluir a tarefa.");
      return;
    }

    try {
      await axios.post(`http://localhost:5047/tarefa/concluir/${idTarefa}/${idMorador}`);
      alert("Tarefa concluída com sucesso!");
      carregarTarefas();
    } catch {
      alert("Erro ao concluir tarefa!");
    }
  }

  // Nova função para deletar tarefa
  async function deletarTarefa(idTarefa: number) {
    try {
      await axios.delete(`http://localhost:5047/deletar/tarefa/${idTarefa}`);
      alert("Tarefa deletada!");
      carregarTarefas();
    } catch {
      alert("Erro ao deletar tarefa!");
    }
  }

  return (
    <div className="tarefa-container">
      <h1>Lista de Tarefas não concluídas</h1>
      <table>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Descrição</th>
            <th>Cômodo</th>
            <th>Concluir (selecione o morador)</th>
            <th>Ações</th> 
          </tr>
        </thead>
        <tbody>
          {tarefas.map((t) => (
            <tr key={t.id}>
              <td>{t.nome}</td>
              <td>{t.descricao}</td>
              <td>{t.nomeComodo}</td>
              <td className="concluir-area">
                <select
                  value={moradorSelecionado[t.id] || 0}
                  onChange={(e) =>
                    setMoradorSelecionado({
                      ...moradorSelecionado,
                      [t.id]: Number(e.target.value),
                    })
                  }
                >
                  <option value="0">Selecione</option>
                  {moradores.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.nome}
                    </option>
                  ))}
                </select>
                <button onClick={() => concluirTarefa(t.id)}>Confirmar</button>
              </td>
              <td>
                <button onClick={() => deletarTarefa(t.id)}>Deletar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ListarTarefas;
