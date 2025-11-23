import "../../../styles/Cadastrar.css";
import { useState } from "react";
import axios from "axios";
import CriarComodo from "../../../../models/CriarComodo";

function CadastrarComodo() {
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");

  function enviarComodo(event: any) {
    event.preventDefault();
    submeterComodoAPI();
  }

  async function submeterComodoAPI() {
    try {
      const comodo: CriarComodo = {
        nome,
        descricao
      };

      const resposta = await axios.post(
        "http://localhost:5047/cadastrar/comodo",
        comodo
      );

      alert("Cômodo cadastrado com sucesso!");
      console.log(await resposta.data);
    } catch (error: any) {
      if (error.status === 409) {
        console.log("Esse cômodo já foi cadastrado!");
      }
    }
  }

  return (
    <div className="cadastro-container">
      <h1>Cadastrar Cômodo</h1>

      <form onSubmit={enviarComodo}>
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
          <button type="submit">Cadastrar</button>
        </div>
      </form>
    </div>
  );
}

export default CadastrarComodo;
