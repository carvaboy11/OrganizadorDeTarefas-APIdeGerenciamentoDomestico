import { useEffect, useState } from "react";
import axios from "axios";
import ComodoDTO from "../../../../models/ComodoDTO"; 
import "./ListarComodo.css"; 

function ListarComodos() {
  const [comodos, setComodos] = useState<ComodoDTO[]>([]);
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [novoNome, setNovoNome] = useState("");
  const [novaDescricao, setNovaDescricao] = useState("");
  const [expandidoId, setExpandidoId] = useState<number | null>(null);

  useEffect(() => {
    buscarComodosAPI();
  }, []);

  async function buscarComodosAPI() {
    try {
      const resposta = await axios.get("http://localhost:5047/listar/comodos");
      setComodos(resposta.data);
    } catch (error: any) {
      console.log("Erro ao buscar cômodos:", error);
    }
  }

  async function deletarComodo(id: number) {
    try {
      await axios.delete(`http://localhost:5047/deletar/comodo/${id}`);
      alert("Cômodo excluído!");
      buscarComodosAPI();
    } catch (error) {
      alert("Erro ao excluir o cômodo.");
    }
  }

  function iniciarEdicao(comodo: ComodoDTO) {
    setEditandoId(comodo.id!);
    setNovoNome(comodo.nome);
    setNovaDescricao(comodo.descricao);
  }

  function cancelarEdicao() {
    setEditandoId(null);
    setNovoNome("");
    setNovaDescricao("");
  }

  async function salvarEdicao(id: number) {
    try {
      const comodoAlterado = {
        nome: novoNome,
        descricao: novaDescricao,
      };
      await axios.put(`http://localhost:5047/alterar/comodo/${id}`, comodoAlterado);
      alert("Cômodo alterado!");
      setEditandoId(null);
      buscarComodosAPI();
    } catch (error) {
      alert("Erro ao alterar o cômodo.");
    }
  }

  function toggleExpandir(id: number) {
    setExpandidoId(expandidoId === id ? null : id);
  }

  return (
    <div className="listar-container">
      <h1>Listar Cômodos</h1>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Descrição</th>
            <th>Tarefas</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {comodos.map((c) => (
            <tr key={c.id}>
              <td>{c.id}</td>
              <td>
                {editandoId === c.id ? (
                  <input
                    type="text"
                    value={novoNome}
                    onChange={(e) => setNovoNome(e.target.value)}
                  />
                ) : (
                  c.nome
                )}
              </td>
              <td>
                {editandoId === c.id ? (
                  <input
                    type="text"
                    value={novaDescricao}
                    onChange={(e) => setNovaDescricao(e.target.value)}
                  />
                ) : (
                  c.descricao
                )}
              </td>
              <td>
                <button onClick={() => toggleExpandir(c.id!)}>
                  {expandidoId === c.id ? "Ocultar Tarefas" : "Ver Tarefas"}
                </button>
                {expandidoId === c.id && (
                  <ul className="tarefas-lista">
                    {c.tarefas?.length ? (
                      c.tarefas.map((t) => (
                        <li key={t.id}>{t.nome}</li>
                      ))
                    ) : (
                      <li>Nenhuma tarefa</li>
                    )}
                  </ul>
                )}
              </td>
              <td>
                {editandoId === c.id ? (
                  <>
                    <button onClick={() => salvarEdicao(c.id!)}>Salvar</button>
                    <button onClick={cancelarEdicao}>Cancelar</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => iniciarEdicao(c)}>Alterar</button>
                    <button onClick={() => deletarComodo(c.id!)}>Deletar</button>
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

export default ListarComodos;
