using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Redacted.API.Models
{
    public class Player
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        public Guid GameId { get; set; }
        [ForeignKey("GameId")]
        public Game? Game { get; set; }

        [Required]
        [MaxLength(255)]
        public string UserId { get; set; } = string.Empty;

        [Required]
        [MaxLength(20)]
        public string Faction { get; set; } = "citizen"; // mafia1, mafia2, mafia3, citizen

        [Required]
        [MaxLength(30)]
        public string Role { get; set; } = "unemployed"; // hacker, analyst, doctor, intel, banker, farmer, cybersmith, whitehat, unemployed

        public bool IsActive { get; set; } = true;

        public int Karma { get; set; } = 0;

        public int Cyberhealth { get; set; } = 100;

        public DateTime JoinedAt { get; set; } = DateTime.UtcNow;

        public DateTime LastActionAt { get; set; } = DateTime.UtcNow;

        public ICollection<Action> Actions { get; set; } = new List<Action>();
        public ICollection<Resource> Resources { get; set; } = new List<Resource>();
    }
}
