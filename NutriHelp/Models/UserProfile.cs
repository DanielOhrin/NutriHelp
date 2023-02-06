using System;
using System.ComponentModel.DataAnnotations;

namespace NutriHelp.Models
{
    public class UserProfile
    {
        public int Id { get; set; }
        [Required]
        [StringLength(28)]
        public string FirebaseId { get; set; }

        [Required]
        [StringLength(30)]
        public string Email { get; set; }

        [Required]
        [StringLength(15)]
        public string Username { get; set; }

        [Required]
        [StringLength(25)]
        public string FirstName { get; set; }

        [Required]
        [StringLength(25)]
        public string LastName { get; set; }

        [Required]
        public char Gender { get; set; }

        [Required]
        [Range(1, 4)]
        public int ActivityLevel { get; set; }

        [Required]
        [Range(1, 5)]
        public int WeightGoal { get; set; }

        [Required]
        [Range(36, 318)] //! in kilograms
        public int Weight { get; set; }

        [Required]
        [Range(90, 205)]
        public int Height { get; set; } //! in centimeters

        [Required]
        public DateTime BirthDate { get; set; }

        public DateTime DateCreated { get; set; }

        public int UserTypeId { get; set; }
        public UserType UserType { get; set; }
        public DailyStats DailyStats { get; set; }
    }
}
