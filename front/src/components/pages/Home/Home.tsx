import React from "react";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="home-container">
      <h1>Bem-vindo ao Sistema de Gerenciamento de Tarefas</h1>
      <p className="home-subtitle">
        Aqui você pode cadastrar e listar cômodos, moradores e tarefas. Clique no Gerenciamento de Tarefas para retornar a essa página.
      </p>

      <div className="home-card-container">

        <div className="home-card">
          <h2>Cadastrar Cômodo</h2>
          <p>Adicione novos cômodos à sua residência.</p>
          <Link className="home-btn" to="/cadastrar/comodo">Ir para Cadastro</Link>
        </div>

        <div className="home-card">
          <h2>Cadastrar Morador</h2>
          <p>Registre moradores que participarão das tarefas.</p>
          <Link className="home-btn" to="/cadastrar/morador">Ir para Cadastro</Link>
        </div>

        <div className="home-card">
          <h2>Cadastrar Tarefa</h2>
          <p>Crie tarefas e associe a um cômodo existente.</p>
          <Link className="home-btn" to="/cadastrar/tarefa">Ir para Cadastro</Link>
        </div>

        {/* --- Listar --- */}
        <div className="home-card">
          <h2>Listar Cômodos</h2>
          <p>Visualize todos os cômodos cadastrados e suas tarefas.</p>
          <Link className="home-btn" to="/listar/comodos">Ir para Listagem</Link>
        </div>

        <div className="home-card">
          <h2>Listar Moradores</h2>
          <p>Veja todos os moradores cadastrados e suas tarefas concluídas.</p>
          <Link className="home-btn" to="/listar/moradores">Ir para Listagem</Link>
        </div>

        <div className="home-card">
          <h2>Listar Tarefas não concluídas</h2>
          <p>Visualize todas as tarefas cadastradas e conclua quando necessário.</p>
          <Link className="home-btn" to="/listar/tarefas">Ir para Listagem</Link>
        </div>

        <div className="home-card">
          <h2>Listar Tarefas concluídas</h2>
          <p>Visualize todas as tarefas já concluídas com o morador responsável.</p>
          <Link className="home-btn" to="/listar/tarefas-concluidas">Ir para Listagem</Link>
        </div>

      </div>
    </div>
  );
}

export default Home;
