using System.Runtime.InteropServices;
using System.Text.Json.Serialization;
using APIdeGerenciamentoDeTarefas.DTO;
using APIdeGerenciamentoDeTarefas.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;


var builder = WebApplication.CreateBuilder(args);
builder.Services.AddDbContext<Context>();
builder.Services.Configure<Microsoft.AspNetCore.Http.Json.JsonOptions>(options =>
{
    options.SerializerOptions.AllowTrailingCommas = true;
    options.SerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
});

var app = builder.Build();

app.MapGet("/", () => "API de Organização da Casa!!");

//Cadastrar Comodo
app.MapPost("/cadastrar/comodo", async ([FromBody] Comodo comodo, [FromServices] Context context) =>
{
    Comodo? resultado = context.Comodos.FirstOrDefault(c => c.Nome == comodo.Nome && c.Descricao == comodo.Descricao);
    if (resultado != null)
    {
        return Results.BadRequest("Comodo ja cadastrado");
    }

    context.Comodos.Add(comodo);
    await context.SaveChangesAsync();
    return Results.Created($"/cadastrar/comodo/{comodo.Nome}", comodo);
});

//Cadastrar Morador
app.MapPost("/cadastrar/morador", async ([FromBody] Morador morador, [FromServices] Context context) =>
{
    Morador? resultado = context.Moradores.FirstOrDefault(m => m.Cpf == morador.Cpf);
    if (resultado != null)
    {
        return Results.BadRequest("Morador ja cadastrado");
    }

    context.Moradores.Add(morador);
    await context.SaveChangesAsync();
    return Results.Created($"/cadastrar/morador/{morador.Nome}", morador);
});

//Cadastrar Tarefas
app.MapPost("/cadastrar/tarefa", async ([FromBody] Tarefa tarefa, [FromServices] Context context) =>
{
    Tarefa? resultado = context.Tarefas.FirstOrDefault(t => t.Nome == tarefa.Nome && t.Descricao == tarefa.Descricao);
    if (resultado is not null)
    {
        return Results.BadRequest("Tarefa ja cadastrada");
    }

    var comodo = await context.Comodos.FindAsync(tarefa.ComodoId);
    if (comodo == null)
    {
        return Results.BadRequest($"ComodoId {tarefa.ComodoId} nao existe");
    }

    context.Tarefas.Add(new Tarefa
    {
        Nome = tarefa.Nome,
        Descricao = tarefa.Descricao,
        ComodoId = tarefa.ComodoId
    });

    context.Tarefas.Add(tarefa);
    await context.SaveChangesAsync();
    return Results.Created($"/cadastrar/tarefa/{tarefa.Nome}", tarefa);
});

//Listar Comodos
app.MapGet("/listar/comodos", async ([FromServices] Context context) =>
{
    var comodos = await context.Comodos
                        .Include(c => c.Tarefas)
                        .Select(c => new ComodoDTO
                        {
                            Id = c.Id,
                            Nome = c.Nome,
                            Descricao = c.Descricao,
                            Tarefas = c.Tarefas.Select(t => new TarefaDTO
                            {
                                Id = t.Id,
                                Nome = t.Nome,
                                Descricao = t.Descricao
                            }).ToList()
                        })
                        .ToListAsync();

    if (comodos.Count == 0)
    {
        return Results.NotFound();
    }

    return Results.Ok(comodos);

});

//Listar tarefas
app.MapGet("/listar/tarefas", async ([FromServices] Context context) =>
{
    var tarefas = await context.Tarefas
        .Include(t => t.Comodo)
        .Select(t => new TarefaComNomeComodoDTO
        {
            Id = t.Id,
            Nome = t.Nome,
            Descricao = t.Descricao,
            NomeComodo = t.Comodo.Nome
        })
        .ToListAsync();

    if (tarefas.Count == 0)
    {
        return Results.NotFound("Tarefas nao encontradas!!");
    }
    return tarefas.Count == 0 ? Results.NotFound() : Results.Ok(tarefas);
});

//Listar Moradores com tarefas feitas
app.MapGet("/listar/moradores", async ([FromServices] Context context) =>
{
    var moradores = await context.Moradores
        .Include(m => m.TarefasConcluidas)
        .ToListAsync();

    if (moradores.Count == 0)
    {
        return Results.NotFound("Nenhum morador encontrado!");
    }

    var resultado = moradores.Select(m => new MoradorComTarefaDTO
    {
        Id = m.Id,
        Nome = m.Nome,
        TarefasConcluidas = m.TarefasConcluidas.Select(tc => new TarefaConcluidaSimplesDTO
        {
            NomeTarefa = tc.Nome,
            DataConclusao = tc.DataConclusao
        }).ToList()
    }).ToList();

    return Results.Ok(resultado);
});

//Listar tarefas concluidas com nome do morador
app.MapGet("/listar/tarefas-concluidas", async ([FromServices] Context context) =>
{
    var tarefasConcluidas = await context.TarefasConcluidas
        .Include(tc => tc.morador)
        .ToListAsync();

    if (tarefasConcluidas.Count == 0)
    {
        return Results.NotFound("Nenhuma tarefa concluída encontrada!!");
    }

    var resultado = tarefasConcluidas.Select(tc => new TarefaConcluidaComMoradorComodoDTO
    {
        NomeMorador = tc.morador.Nome,
        NomeComodo = tc.Nome, 
        DataConclusao = tc.DataConclusao
    }).ToList();

    return Results.Ok(resultado);
});

//Concluir tarefa
app.MapPost("/tarefa/concluir/{idTarefa}/{idMorador}", async ([FromRoute] int idTarefa, [FromRoute] int idMorador, [FromServices] Context context) =>
{
    var tarefa = await context.Tarefas
        .Include(t => t.Comodo)
        .FirstOrDefaultAsync(t => t.Id == idTarefa);

    if (tarefa == null)
        return Results.NotFound("Tarefa não encontrada!!");

    var morador = await context.Moradores.FindAsync(idMorador);
    if (morador == null)
        return Results.NotFound("Morador não encontrado.");

    var tarefaConcluida = new TarefaConcluida
    {
        Nome = tarefa.Nome,
        Descricao = tarefa.Descricao,
        DataConclusao = DateTime.Now,
        MoradorId = morador.Id,
        morador = morador
    };

    await context.TarefasConcluidas.AddAsync(tarefaConcluida);

    context.Tarefas.Remove(tarefa);

    await context.SaveChangesAsync();

    return Results.Ok($"Tarefa '{tarefa.Nome}' concluída por {morador.Nome} e movida para TarefasConcluidas.");
});

//Deletar tarefa com id
app.MapDelete("/deletar/tarefa/{id}", async ([FromRoute] int id, [FromServices] Context context) =>
{
    var tarefa = await context.Tarefas.FindAsync(id);
    if (tarefa == null)
    {
        return Results.NotFound("Tarefa nao encontrada!!");
    }
    context.Tarefas.Remove(tarefa);
    await context.SaveChangesAsync();
    return Results.NoContent();
});

//Deletar comodo com id
app.MapDelete("/deletar/comodo/{id}", async ([FromRoute] int id, [FromServices] Context context) =>
{
    var comodo = await context.Comodos.FindAsync(id);
    if (comodo == null)
    {
        return Results.NotFound("Comodo nao encontrado!!");
    }
    context.Comodos.Remove(comodo);
    await context.SaveChangesAsync();
    return Results.NoContent();
});

app.Run();
