namespace CMA.Middleware
{
    public class AuthorizationHeaderMiddleware
    {
        private readonly RequestDelegate _next;

        public AuthorizationHeaderMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            var requestToken = context.Request.Headers["Authorization"];

            if (!string.IsNullOrEmpty(requestToken))
            {
                context.Request.Headers.Remove("Authorization");
                string auth = requestToken.ToString().Replace("Bearer ", "").ToString();
                context.Request.Headers.Add("Authorization", "Bearer " + auth);
            }

            await _next(context);
        }
    }
}
