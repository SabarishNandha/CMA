using CMA.DAL;

namespace CMA.Infrastructure
{
    public static class Infrastructure
    {
        public static void ConfigureServices(IServiceCollection services)
        {
            services.AddControllers();
            services.AddScoped<IContactRepository, ContactRepository>();
        }
    }
}
