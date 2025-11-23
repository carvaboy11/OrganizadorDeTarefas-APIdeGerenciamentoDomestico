import "../../../styles/Cadastrar.css";
import { useState } from "react";
import axios from "axios";
import CreateMorador from "../../../../models/CriarMorador";

function CadastrarMorador() {
  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");

  function enviarMorador(event: any) {
    event.preventDefault();
    submeterMoradorAPI();
  }

  async function submeterMoradorAPI() {
    try {
      const morador: CreateMorador = {
        nome,
        cpf
      };

      const resposta = await axios.post(
        "http://localhost:5047/cadastrar/morador",
        morador
      );

      alert("Morador cadastrado com sucesso!");
      console.log(await resposta.data);
    } catch (error: any) {
      console.log("Erro ao cadastrar morador!", error);
    }
  }

  return (
    <div className="cadastro-container">
      <h1>Cadastrar Morador</h1>

      <form onSubmit={enviarMorador}>
        <div>
          <label>Nome:</label>
          <input type="text" onChange={(e: any) => setNome(e.target.value)} />
        </div>

        <div>
          <label>CPF:</label>
          <input type="text" onChange={(e: any) => setCpf(e.target.value)} />
        </div>

        <div>
          <button type="submit">Cadastrar</button>
        </div>
      </form>
    </div>
  );
}

export default CadastrarMorador;
