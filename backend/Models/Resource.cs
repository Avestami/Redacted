using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Redacted.API.Models
{
    public class Resource
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        public Guid PlayerId { get; set; }
        [ForeignKey("PlayerId")]
        public Player? Player { get; set; }

        public int Battery { get; set; } = 100;

        public int Capital { get; set; } = 50;

        [Column(TypeName = "jsonb")]
        public string Cyberware { get; set; } = "[]";

        public DateTime LastUpdated { get; set; } = DateTime.UtcNow;
    }
}
