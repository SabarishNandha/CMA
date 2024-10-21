using CMA.Infrastructure;
using CMA.Middleware;
using CMA.Model;
using Microsoft.OpenApi.Models;
using Serilog;

var builder = WebApplication.CreateBuilder(args);

// Configure Serilog
Log.Logger = new LoggerConfiguration()
    .WriteTo.Console() // Optional: log to the console
    .WriteTo.File("Logs/log.txt", rollingInterval: RollingInterval.Day) // Log to a text file, with a new file created daily
    .CreateLogger();

// Use Serilog for logging
builder.Logging.ClearProviders(); // Remove other loggers
builder.Logging.AddSerilog();

// Bind AppConfig
var appconfig = new AppConfig();
builder.Configuration.Bind("AnalyticsAppsettings", appconfig);
builder.Services.AddSingleton(appconfig);

// Add services to the container.

builder.Services.AddControllersWithViews();

Infrastructure.ConfigureServices(builder.Services);


// Add Swagger services
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "My API", Version = "v1" });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

// Register GlobalExceptionMiddleware first to catch any unhandled exceptions
app.UseMiddleware<GlobalExceptionMiddleware>();

// Register AuthorizationHeaderMiddleware to manipulate the Authorization header
app.UseMiddleware<AuthorizationHeaderMiddleware>();


app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

// Enable middleware to serve generated Swagger as a JSON endpoint.
app.UseSwagger();

// Enable middleware to serve Swagger UI (HTML, JS, CSS, etc.),
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "My API V1");
});


app.MapControllerRoute(
    name: "default",
    pattern: "{controller}/{action=Index}/{id?}");

app.MapFallbackToFile("index.html"); ;

app.Run();
