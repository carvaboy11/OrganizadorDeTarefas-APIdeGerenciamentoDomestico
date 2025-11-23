using System;

namespace APIdeGerenciamentoDeTarefas.Models;

public class TarefaConcluida
{
    public int Id { get; set; }
    public string Nome { get; set; } = string.Empty;
    public DateTime DataConclusao { get; set; }
    public int MoradorId { get; set; }
    public Morador Morador { get; set; } = null!;
    public int? ComodoId { get; set; }
    public Comodo? Comodo { get; set; }
}