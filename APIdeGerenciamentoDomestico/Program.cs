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

app.Run();
