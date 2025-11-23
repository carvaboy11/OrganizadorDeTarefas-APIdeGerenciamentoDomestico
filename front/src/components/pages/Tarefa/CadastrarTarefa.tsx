import "../../../styles/Cadastrar.css";
import { useEffect, useState } from "react";
import axios from "axios";
import CreateTarefa from "../../../../models/CriarTarefa";

interface ComodoDTO {
  id: number;
  nome: string;
  descricao: string;
}

function CadastrarTarefa() {
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [comodoId, setComodoId] = useState(0);

  const [comodos, setComodos] = useState<ComodoDTO[]>([]);

  useEffect(() => {
    carregarComodos();
  }, []);

  async function carregarComodos() {
    try {
      const resposta = await axios.get("http://localhost:5047/listar/comodos");
      setComodos(resposta.data);
    } catch (error: any) {
      console.log("Erro ao carregar cômodos!", error);
    }
  }

  function enviarTarefa(event: any) {
    event.preventDefault();
    submeterTarefaAPI();
  }

  async function submeterTarefaAPI() {
    try {
      const tarefa: CreateTarefa = {
        nome,
        descricao,
        comodoId: Number(comodoId)
      };

      const resposta = await axios.post(
        "http://localhost:5047/cadastrar/tarefa",
        tarefa
      );

      alert("Tarefa cadastrada com sucesso!");
      console.log(await resposta.data);
    } catch (error: any) {
      console.log("Erro ao cadastrar tarefa!", error);
    }
  }

  return (
    <div className="cadastro-container">
      <h1>Cadastrar Tarefa</h1>

      <form onSubmit={enviarTarefa}>
        <div>
          <label>Nome:</label>
          <input
            type="text"
            onChange={(e: any) => setNome(e.target.value)}
          />
        </div>

        <div>
          <label>Descrição:</label>
          <input
            type="text"
            onChange={(e: any) => setDescricao(e.target.value)}
          />
        </div>

        <div>
          <label>Cômodo:</label>
          <select onChange={(e: any) => setComodoId(e.target.value)}>
            <option value="0">Selecione um cômodo</option>

            {comodos.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nome}
              </option>
            ))}
          </select>
        </div>

        <div>
          <button type="submit">Cadastrar</button>
        </div>
      </form>
    </div>
  );
}

export default CadastrarTarefa;
