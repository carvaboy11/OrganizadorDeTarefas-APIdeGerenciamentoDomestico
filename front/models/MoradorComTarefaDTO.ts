import TarefaConcluidaSimplesDTO from "./TarefaConcluidaSimplesDTO";

export default interface MoradorComTarefaDTO {
  id: number;
  nome: string;
  tarefasConcluidas: TarefaConcluidaSimplesDTO[];
}
