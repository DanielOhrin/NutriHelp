using System;

namespace NutriHelp.Models
{
    public class DailyStats
    {
        public int CalorieGoal { get; set; }
        public int CaloriesRemaining { get; set; }
        public int WaterGoal { get; set; }
        public int WaterConsumed { get; set; }
        public int WaterRemaining { get; set; }
        public int ExerciseMinutes { get; set; }
        public DateTime Date { get; set; }
    }
}
