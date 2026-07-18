
using System.Text.Json;
using Microsoft.Net.Http.Headers;

var builder = WebApplication.CreateBuilder(args);
var MyAllowSpecificOrigins = "taksflow-frontend";
builder.Services.AddCors(options =>
{
  options.AddPolicy(name: MyAllowSpecificOrigins,
                    policy =>
                    {
                      policy.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader();
                    });
});

var app = builder.Build();

app.UseCors(MyAllowSpecificOrigins);



string getFileName<T>()
{
    if (typeof(T) == typeof(Project))
    {
        return "./db/projects-data.json";
    }
    if (typeof(T) == typeof(Todo))
    {
       return "./db/todos-data.json";
    }
    return "";
}


async Task<List<T>> ReadData<T>()
{
    try
    {
        string pathToFile = getFileName<T>();
        string stringData = await File.ReadAllTextAsync(pathToFile);
        return JsonSerializer.Deserialize<List<T>>(stringData);
    }
    catch
    {
        throw;
    }
}



void SaveData<T>(List<T> data)
{
    string pathToFile = getFileName<T>();
    File.WriteAllText(pathToFile, JsonSerializer.Serialize(data));

}


app.MapGet("/api/v1/projects", async () =>
{
    var projectsData =await ReadData<Project>();
    return Results.Ok(projectsData);
});

app.MapPost("/api/v1/projects", async (Project project) =>
{
    try
    {
        var projects = await ReadData<Project>();
        if (projects != null)
        {
            string idCurto = Guid.NewGuid().ToString();
            Project newProject = project with { Id = idCurto };
            projects.Add(newProject);
            SaveData<Project>(projects);
            return Results.Ok();

        }
        return Results.Ok();


    }
    catch
    {
        throw;

    }
});


app.MapGet("/api/v1/tasks", async (string? projectId, int? userId) =>
{
    try
    {
        var todos = await ReadData<Todo>();
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

    }
    catch
    {
        throw;
    }
});


app.MapPost("/api/v1/tasks", async (Todo todo) =>
{
    try
    {
        var todos = await ReadData<Todo>();
        string idCurto = Guid.NewGuid().ToString();
        Todo newTodo = todo with { Id = idCurto };
        todos.Add(newTodo);
        SaveData<Todo>(todos);
        var projects = await ReadData<Project>();
        int projectFinded = projects.FindIndex(i => i.Id == newTodo.ProjectId);
        if (projectFinded != -1)
        {
            projects[projectFinded] = projects[projectFinded] with
            {
                total = projects[projectFinded].total + 1  // incrementa
            };
            SaveData<Project>(projects);
        }

        return Results.Ok();

    } catch
    {
        throw;
    }
});


app.MapPatch("/api/v1/tasks/{taskId}", async (string taskId, Todo updatedTodo) =>
{
    try
    {
        var todos = await ReadData<Todo>();
        var todo = todos.FirstOrDefault(t => t.Id == taskId);
        if (todo == null)
            return Results.NotFound();

        Console.WriteLine(todo.Id);
        Todo todoCopy = updatedTodo with{ Id = todo.Id};

        todos.Remove(todo);
        todos.Add(todoCopy);
        SaveData<Todo>(todos);
        return Results.Ok();

    }
    catch
    {
        return Results.Ok();
    }
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