using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json;

namespace Redacted.API.Models
{
    public class Action
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        public Guid GameId { get; set; }
        [ForeignKey("GameId")]
        public Game? Game { get; set; }

        [Required]
        public Guid PlayerId { get; set; }
        [ForeignKey("PlayerId")]
        public Player? Player { get; set; }

        [Required]
        [MaxLength(30)]
        public string ActionType { get; set; } = string.Empty; // hack, analyze, heal, intel, protect, sabotage

        public Guid? TargetId { get; set; }
        [ForeignKey("TargetId")]
        public Player? Target { get; set; }

        [Column(TypeName = "jsonb")]
        public string ResourceCost { get; set; } = "{}";

        [Column(TypeName = "jsonb")]
        public string Outcome { get; set; } = "{}";

        public bool Success { get; set; } = true;

        public DateTime PerformedAt { get; set; } = DateTime.UtcNow;
    }
}
