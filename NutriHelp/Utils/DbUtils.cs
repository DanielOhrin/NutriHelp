using System;
using System.Data;

using Microsoft.Data.SqlClient;

namespace NutriHelp.Utils
{
    public static class DbUtils
    {
        public static string GetString(SqlDataReader reader, string column)
        {
            return reader.GetString(reader.GetOrdinal(column));
        }

        public static string? GetNullableString(SqlDataReader reader, string column)
        {
            int ordinal = reader.GetOrdinal(column);

            if (reader.IsDBNull(ordinal))
            {
                return null;
            }

            return reader.GetString(ordinal);
        }

        public static int GetInt(SqlDataReader reader, string column)
        {
            return reader.GetInt32(reader.GetOrdinal(column));
        }

        public static int? GetNullableInt(SqlDataReader reader, string column)
        {
            int ordinal = reader.GetOrdinal(column);

            if (reader.IsDBNull(ordinal))
            {
                return null;
            }

            return reader.GetInt32(ordinal);
        }

        public static char GetChar(SqlDataReader reader, string column)
        {
            char[] chars = new char[1];

            reader.GetChars(reader.GetOrdinal(column), 0, chars, 0, 1);

            return chars[0];
        }

        public static DateTime GetDateTime(SqlDataReader reader, string column)
        {
            return reader.GetDateTime(reader.GetOrdinal(column));
        }

        public static decimal GetDecimal(SqlDataReader reader, string column)
        {
            return reader.GetDecimal(reader.GetOrdinal(column));
        }

        public static void AddParameter(SqlCommand cmd, string parameterName, object value)
        {
            if (value == null)
            {
                cmd.Parameters.AddWithValue(parameterName, DBNull.Value);
            }
            else
            {
                cmd.Parameters.AddWithValue(parameterName, value);
            }
        }
    }
}
