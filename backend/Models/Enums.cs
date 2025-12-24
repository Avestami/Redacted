namespace Redacted.API.Models
{
    public enum FactionType
    {
        Citizen,
        MafiaA,
        MafiaB,
        MafiaC
    }

    public enum RoleType
    {
        // Mafia Roles
        Hacker,
        Analyst,
        Doctor, // Mafia Doctor
        Intel,

        // Citizen Roles
        Banker,
        Farmer,
        Cybersmith,
        CitizenDoctor, // Citizen Doctor
        WhiteHat,
        Unemployed
    }

    public enum GameStatus
    {
        Waiting,
        Act1,
        Act2,
        Act3,
        Finished
    }

    public enum ActionType
    {
        // General / Resource
        Work, // Generate Capital/Battery
        
        // Offensive
        Hack,
        Sabotage,
        
        // Defensive
        Protect,
        Heal,
        
        // Info
        Analyze,
        GatherIntel
    }
}
