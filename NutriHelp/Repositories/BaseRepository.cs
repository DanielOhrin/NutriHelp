using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;

namespace NutriHelp.Repositories
{
    public class BaseRepository
    {
        private readonly string _connectionString;

        public BaseRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection");
        }

        protected SqlConnection Connection => new(_connectionString);
    }
}
