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
        public FactionType Faction { get; set; } = FactionType.Citizen;

        [Required]
        public RoleType Role { get; set; } = RoleType.Unemployed;

        public bool IsActive { get; set; } = true;

        // Core Resources
        public int Karma { get; set; } = 50; // Start middle
        public int Cyberhealth { get; set; } = 100;

        public DateTime JoinedAt { get; set; } = DateTime.UtcNow;

        public DateTime LastActionAt { get; set; } = DateTime.UtcNow;

        public ICollection<Action> Actions { get; set; } = new List<Action>();
        
        // We use a list, but logically it's often 1:1. EF Core handles this.
        public ICollection<Resource> Resources { get; set; } = new List<Resource>();
    }
}
