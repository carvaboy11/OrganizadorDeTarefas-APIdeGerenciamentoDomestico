import React, { useEffect, useState } from "react";
import axios from "axios";
import "./ListarTarefa.css";
import TarefaConcluidaDTO from "../../../../models/TarefaConcluidaDTO";


function ListarTarefasConcluidas() {
  const [tarefasConcluidas, setTarefasConcluidas] = useState<TarefaConcluidaDTO[]>([]);

  useEffect(() => {
    carregarTarefasConcluidas();
  }, []);

  async function carregarTarefasConcluidas() {
    try {
      const resposta = await axios.get("http://localhost:5047/listar/tarefas-concluidas");
      setTarefasConcluidas(resposta.data);
    } catch {
      console.log("Erro ao carregar tarefas concluídas!");
    }
  }

  return (
    <div className="tarefa-container">
      <h1>Lista de Tarefas Concluídas</h1>

      <table>
        <thead>
          <tr>
            <th>Morador</th>
            <th>Cômodo</th>
            <th>Tarefa</th>
            <th>Data de Conclusão</th>
          </tr>
        </thead>
        <tbody>
          {tarefasConcluidas.length === 0 ? (
            <tr>
              <td colSpan={4}>Nenhuma tarefa concluída encontrada</td>
            </tr>
          ) : (
            tarefasConcluidas.map((t, index) => (
              <tr key={index}>
                <td>{t.nomeMorador}</td>
                <td>{t.nomeComodo}</td>
                <td>{t.nomeTarefa}</td>
                <td>{new Date(t.dataConclusao).toLocaleString()}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default ListarTarefasConcluidas;
