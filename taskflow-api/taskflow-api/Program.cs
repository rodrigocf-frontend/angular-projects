
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

List<Todo> todos =
[];

List<Project> projects = [];

app.MapGet("/api/v1/tasks", (string? projectId, int? userId) =>
{
  if (!string.IsNullOrEmpty(projectId))
  {
    var result = todos.Where(i => i.ProjectId == projectId);
    return result;
  }
  else if (userId is not null)
  {
    var result = todos.Where(t => t.UserId == userId);
    return result;
  }
  return todos;
});


app.MapPatch("/api/v1/tasks/{taskId}", (string taskId, Todo updatedTodo) =>
{
  var todo = todos.FirstOrDefault(t => t.Id == taskId);

  if (todo == null)
    return Results.NotFound();

  todos.Remove(todo);
  todos.Add(updatedTodo);
  return Results.Ok();
});

app.MapPost("/api/v1/tasks", (Todo todo) =>
{
  Console.WriteLine(todo);
  string idCurto = Guid.NewGuid().ToString();
  Todo newTodo = todo with { Id = idCurto };
  todos.Add(newTodo);
  return Results.Ok();
});

app.MapPost("/api/v1/projects", (Project project) =>
{
  string idCurto = Guid.NewGuid().ToString();
  Project newProject = project with { Id = idCurto };
  projects.Add(newProject);
  return Results.Ok();
});

app.MapGet("/api/v1/projects", () => Results.Ok(projects));

app.Run();

public record Project(
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
