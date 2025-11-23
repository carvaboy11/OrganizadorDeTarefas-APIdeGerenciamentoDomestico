import TarefaDTO from "./TarefaDTO";

export default interface ComodoDTO {
  id?: number;
  nome: string;
  descricao: string;
  tarefas?: TarefaDTO[];
}
