import TarefaConcluidaDTO from "./TarefaConcluidaSimplesDTO";

export default interface Morador {
  id?: number;
  nome: string;
  cpf: string;
  tarefasConcluidas?: TarefaConcluidaDTO[];
}
