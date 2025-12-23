using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Redacted.API.Models
{
    public class AiAnalysis
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        public Guid GameId { get; set; }
        [ForeignKey("GameId")]
        public Game? Game { get; set; }

        [Column(TypeName = "jsonb")]
        public string TrustMatrix { get; set; } = "{}";

        [Column(TypeName = "jsonb")]
        public string BehavioralPatterns { get; set; } = "[]";

        [Column(TypeName = "jsonb")]
        public string Predictions { get; set; } = "{}";

        public float Confidence { get; set; } = 0.0f;

        public int TrainingDataSize { get; set; } = 0;

        public DateTime AnalyzedAt { get; set; } = DateTime.UtcNow;
    }
}
