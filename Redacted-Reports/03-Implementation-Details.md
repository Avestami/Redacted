# Redacted Project: Implementation Details & Git Strategy

## 1. Directory Structure
The project is organized as a monorepo, keeping all distinct layers in one place for easier development and version control.

*   **`/frontend`**: Contains the Next.js application.
    *   `app/`: Uses the App Router for file-system based routing.
    *   `components/`: Reusable UI elements.
    *   `services/`: TypeScript API clients to communicate with the backend.
*   **`/backend`**: Contains the .NET Web API.
    *   `Controllers/`: HTTP endpoints.
    *   `Services/`: Business logic implementation.
    *   `Data/`: Database context and entity configurations.
    *   `Models/`: C# classes mirroring the database schema.
*   **`/database`**: SQL scripts for schema initialization.

## 2. Key Implementation Highlights

### The AI Service (`backend/Services/AiService.cs`)
This is the heart of the "Redacted" mechanic. It bridges the gap between raw game data and narrative outcomes.
*   **Approach:** It likely aggregates `Action` data and `Player` states to calculate a `TrustScore`.
*   **Learning:** It demonstrates how to decouple the "Intelligence" from the "Mechanics".

### The Game Loop (`backend/Services/GameService.cs`)
Manages the state machine of the game (Waiting -> Act I -> Act II -> ...).
*   **Approach:** Using a state pattern to manage transitions ensures the game never enters an invalid state.

## 3. Version Control Strategy (Git)
We are initializing this project with a standard Git flow.

*   **Initialization:** The root directory is the repository root.
*   **Ignores:** strict `.gitignore` to keep the repo clean (ignoring `bin`, `obj`, `node_modules`).
*   **Remote:** Pushing to GitHub via SSH for secure collaboration.

## 4. Next Steps
1.  **Run Migrations:** Ensure the PostgreSQL database is up to date with `schema.sql`.
2.  **Build Backend:** `dotnet build` in the backend folder.
3.  **Install Frontend:** `npm install` in the frontend folder.
4.  **Launch:** Run both services to start the game environment.
