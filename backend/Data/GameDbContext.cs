using Microsoft.EntityFrameworkCore;
using Redacted.API.Models;

namespace Redacted.API.Data
{
    public class GameDbContext : DbContext
    {
        public GameDbContext(DbContextOptions<GameDbContext> options) : base(options)
        {
        }

        public DbSet<Game> Games { get; set; }
        public DbSet<Player> Players { get; set; }
        public DbSet<Redacted.API.Models.Action> Actions { get; set; }
        public DbSet<Resource> Resources { get; set; }
        public DbSet<AiAnalysis> AiAnalyses { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure relationships and indexes
            modelBuilder.Entity<Game>()
                .HasIndex(g => g.RoomCode)
                .IsUnique();

            modelBuilder.Entity<Game>()
                .HasIndex(g => g.Status);
                
            modelBuilder.Entity<Game>()
                .Property(g => g.Status)
                .HasConversion<string>();

            modelBuilder.Entity<Player>()
                .HasIndex(p => p.UserId);

            modelBuilder.Entity<Player>()
                .Property(p => p.Faction)
                .HasConversion<string>();

            modelBuilder.Entity<Player>()
                .Property(p => p.Role)
                .HasConversion<string>();

            modelBuilder.Entity<Redacted.API.Models.Action>()
                .Property(a => a.ActionType)
                .HasConversion<string>();

            modelBuilder.Entity<Redacted.API.Models.Action>()
                .HasOne(a => a.Game)
                .WithMany(g => g.Actions)
                .HasForeignKey(a => a.GameId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Redacted.API.Models.Action>()
                .HasOne(a => a.Player)
                .WithMany(p => p.Actions)
                .HasForeignKey(a => a.PlayerId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Resource>()
                .HasOne(r => r.Player)
                .WithMany(p => p.Resources)
                .HasForeignKey(r => r.PlayerId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<AiAnalysis>()
                .HasOne(a => a.Game)
                .WithMany(g => g.AiAnalyses)
                .HasForeignKey(a => a.GameId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
