using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Redacted.API.Models
{
    public class Game
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        [MaxLength(6)]
        public string RoomCode { get; set; } = string.Empty;

        [Required]
        [MaxLength(20)]
        public string Status { get; set; } = "waiting"; // waiting, act1, act2, act3, finished

        [MaxLength(20)]
        public string CurrentPhase { get; set; } = "setup";

        public int ActNumber { get; set; } = 1;

        public Guid HostId { get; set; }

        public int MaxPlayers { get; set; } = 8;

        public int PhaseDurationMinutes { get; set; } = 10;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        public ICollection<Player> Players { get; set; } = new List<Player>();
        public ICollection<Action> Actions { get; set; } = new List<Action>();
        public ICollection<AiAnalysis> AiAnalyses { get; set; } = new List<AiAnalysis>();
    }
}
