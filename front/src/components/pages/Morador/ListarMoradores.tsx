import { useEffect, useState } from "react";
import axios from "axios";
import Morador from "../../../../models/Morador";
import "./ListarMoradores.css";

function ListarMoradores() {
  const [moradores, setMoradores] = useState<Morador[]>([]);
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [novoNome, setNovoNome] = useState("");
  const [novoCpf, setNovoCpf] = useState(""); // Novo estado para o CPF
  const [expandidoId, setExpandidoId] = useState<number | null>(null);

  useEffect(() => {
    buscarMoradoresAPI();
  }, []);

  async function buscarMoradoresAPI() {
    try {
      const resposta = await axios.get("http://localhost:5047/listar/moradores");
      setMoradores(resposta.data);
    } catch (error: any) {
      console.log("Erro ao buscar moradores:", error);
    }
  }

  async function deletarMorador(id: number) {
    const morador = moradores.find((m) => m.id === id);
    if (!morador) return;

    try {
      await axios.delete(
        `http://localhost:5047/deletar/morador/${encodeURIComponent(
          morador.cpf
        )}/${encodeURIComponent(morador.nome)}`
      );
      alert("Morador excluído!");
      buscarMoradoresAPI();
    } catch (error) {
      alert("Erro ao excluir o morador.");
    }
  }

  function iniciarEdicao(morador: Morador) {
    setEditandoId(morador.id || null);
    setNovoNome(morador.nome);
    setNovoCpf(morador.cpf);

  }
  function cancelarEdicao() {
    setEditandoId(null);
    setNovoNome("");
    setNovoCpf("");
  }

  async function salvarEdicao(id: number) {
    const morador = moradores.find((m) => m.id === id);
    if (!morador) return;

    const moradorAlterado = { nome: novoNome, cpf: novoCpf };

    try {
      await axios.put(
        `http://localhost:5047/alterar/morador/${encodeURIComponent(
          morador.cpf
        )}/${encodeURIComponent(morador.nome)}`,
        moradorAlterado
      );
      alert("Morador alterado!");
      setEditandoId(null);
      buscarMoradoresAPI();
    } catch (error) {
      alert("Erro ao alterar o morador.");
    }
  }

  function toggleExpandir(id: number) {
    setExpandidoId(expandidoId === id ? null : id);
  }

  return (
    <div className="listar-container">
      <h1>Listar Moradores</h1>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>CPF</th>
            <th>Tarefas Concluídas</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {moradores.map((m) => (
            <tr key={m.id}>
              <td>{m.id}</td>
              <td>
                {editandoId === m.id ? (
                  <input
                    type="text"
                    value={novoNome}
                    onChange={(e) => setNovoNome(e.target.value)}
                  />
                ) : (
                  m.nome
                )}
              </td>
              <td>
                {editandoId === m.id ? (
                  <input
                    type="text"
                    value={novoCpf}
                    onChange={(e) => setNovoCpf(e.target.value)}
                  />
                ) : (
                  m.cpf
                )}
              </td>
              <td>
                <button onClick={() => toggleExpandir(m.id!)}>
                  {expandidoId === m.id ? "Ocultar Tarefas" : "Ver Tarefas"}
                </button>
                {expandidoId === m.id && (
                  <ul className="tarefas-lista">
                    {m.tarefasConcluidas?.length ? (
                      m.tarefasConcluidas.map((t, index) => (
                        <li key={index}>
                          {t.nomeTarefa} - {t.dataConclusao}
                        </li>
                      ))
                    ) : (
                      <li>Nenhuma tarefa concluída</li>
                    )}
                  </ul>
                )}
              </td>
              <td>
                {editandoId === m.id ? (
                  <>
                    <button onClick={() => salvarEdicao(m.id!)}>Salvar</button>
                    <button onClick={cancelarEdicao}>Cancelar</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => iniciarEdicao(m)}>Alterar</button>
                    <button onClick={() => deletarMorador(m.id!)}>Deletar</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ListarMoradores;
