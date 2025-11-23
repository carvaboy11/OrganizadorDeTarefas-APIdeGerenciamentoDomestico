import React from "react";
import { BrowserRouter, Route, Routes, Link } from "react-router-dom";

import CadastrarComodo from "./components/pages/Comodo/CadastrarComodo";
import CadastrarMorador from "./components/pages/Morador/CadatrarMorador";
import CadastrarTarefa from "./components/pages/Tarefa/CadastrarTarefa";
import ListarComodos from "./components/pages/Comodo/ListarComodo";
import ListarTarefas from "./components/pages/Tarefa/ListarTarefa";
import ListarMoradores from "./components/pages/Morador/ListarMoradores";
import ListarTarefasConcluidas from "./components/pages/Tarefa/ListarTarefaConcluida";
import Home from "./components/pages/Home/Home";

import "./App.css";

function App() {
  return (
    <div id="app">
      <BrowserRouter>
        <header className="app-header">
          <Link to="/" className="header-title">
            Gerenciamento de Tarefas
          </Link>
        </header>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cadastrar/comodo" element={<CadastrarComodo />} />
          <Route path="/cadastrar/morador" element={<CadastrarMorador />} />
          <Route path="/cadastrar/tarefa" element={<CadastrarTarefa />} />
          <Route path="/listar/comodos" element={<ListarComodos />} />
          <Route path="/listar/moradores" element={<ListarMoradores />} /> 
          <Route path="/listar/tarefas" element={<ListarTarefas />} />
          <Route path="/listar/tarefas-concluidas" element={<ListarTarefasConcluidas />} /> 
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
