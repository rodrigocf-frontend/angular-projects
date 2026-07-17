
using System.Text.Json;
using Microsoft.Net.Http.Headers;

var builder = WebApplication.CreateBuilder(args);
var MyAllowSpecificOrigins = "taksflow-frontend";
builder.Services.AddCors(options =>
{
  options.AddPolicy(name: MyAllowSpecificOrigins,
                    policy =>
                    {
                      policy.AllowAnyOrigin()
                        .AllowAnyMethod()
                        .AllowAnyHeader();
                    });
});

var app = builder.Build();

app.UseCors(MyAllowSpecificOrigins);

string pathToFileTodos = @"./todos-data.json";
string pathToFileProject = @"./projects-data.json";

File.Create(pathToFileTodos);
File.Create(pathToFileProject);

List<Project> ReadProjects()
{
    string projectsStringData = File.ReadAllText(pathToFileProject);
    return JsonSerializer.Deserialize<List<Project>>(projectsStringData);
}

List<Todo> ReadTodos()
{
    string todosStringData = File.ReadAllText(pathToFileTodos);
    return JsonSerializer.Deserialize<List<Todo>>(todosStringData);

}

void SaveTodos(List<Todo> allTodos)
{    File.WriteAllText(pathToFileTodos, JsonSerializer.Serialize(allTodos));

}

void SaveProjects(List<Project> allProjects)
{
    File.WriteAllText(pathToFileProject, JsonSerializer.Serialize(allProjects));

}


app.MapGet("/api/v1/tasks", (string? projectId, int? userId) =>
{
    List<Todo> allTodos = ReadTodos();
    if (!string.IsNullOrEmpty(projectId))
  {
    var result = allTodos.Where(i => i.ProjectId == projectId);
    return result;
  }
  else if (userId is not null)
  {
    var result = allTodos.Where(t => t.UserId == userId);
    return result;
  }
  return allTodos;
});


app.MapPatch("/api/v1/tasks/{taskId}", (string taskId, Todo updatedTodo) =>
{
  List<Todo> allTodos = ReadTodos();

  var todo = allTodos.FirstOrDefault(t => t.Id == taskId);

  if (todo == null)
    return Results.NotFound();

  allTodos.Remove(todo);
  allTodos.Add(updatedTodo);
  SaveTodos(allTodos);
  
  return Results.Ok();
});

app.MapPost("/api/v1/tasks", (Todo todo) =>
{
  List<Todo> allTodos = ReadTodos();
  string idCurto = Guid.NewGuid().ToString();
  Todo newTodo = todo with { Id = idCurto };
  allTodos.Add(newTodo);
  SaveTodos(allTodos);
  List<Project> allProjects = ReadProjects();
  int projectFinded = allProjects.FindIndex(i => i.Id == newTodo.ProjectId);
  if (projectFinded != -1)
  {
        allProjects[projectFinded] = allProjects[projectFinded] with
        {
            total = allProjects[projectFinded].total + 1  // incrementa
        };
        SaveProjects(allProjects);
  }
  
  return Results.Ok();
});

app.MapPost("/api/v1/projects", (Project project) =>
{
  List<Project> allProjects = ReadProjects(); 
  string idCurto = Guid.NewGuid().ToString();
  Project newProject = project with { Id = idCurto };
  allProjects.Add(newProject);
  SaveProjects(allProjects);
  return Results.Ok();
});

app.MapGet("/api/v1/projects", () =>
{
    return ReadProjects();
});

app.Run();

public record class Project(
    string Id,
    string Name,
    string Description,
    string Color,
    string? DeadLine,
    int total
);


// record serializa perfeitamente pro JSON
public record Todo(
    string Id,
    string Title,
    string? Description,
    string? DueDate,
    bool Overdue,
    string Priority,
    string Status,
    string Tag,
    string ProjectId,
    int UserId
);