# Downforce Web Scoring App - Implementation Plan

## Tech Stack
- Next.js 14 (App Router)
- TypeScript
- Socket.io (real-time)
- Tailwind CSS
- Vercel deployment

## Phase 1: Project Setup & Core Types
1. Initialize Next.js with TypeScript and Tailwind
2. Create core types (Game, Player, Car, Bet, GameState)
3. Setup project structure (components, lib, types folders)

## Phase 2: Room Management
4. Create room generation utility (4-digit codes)
5. Build Socket.io server in API route
6. Implement in-memory room storage
7. Add join/leave room logic

## Phase 3: Basic UI Flow
8. Create home page with "Create Room" and "Join Room" buttons
9. Build room creation page (host)
10. Build room join page (enter code + name)
11. Create main game room page with role detection (host vs player)

## Phase 4: Auction Phase
12. Build host auction controls (assign cars to players, set prices)
13. Create auction display component for all players
14. Implement auction total calculation

## Phase 5: Betting System
15. Build host controls to set car positions at betting lines
16. Create secret bet submission form for players
17. Implement bet storage (hidden from other players)
18. Add betting round progression (Bet 1 → Bet 2 → Bet 3)

## Phase 6: Race Finish & Scoring
19. Build host controls for final car positions
20. Implement odds betting payout calculation logic
21. Create reveal component (show all bets + scores)
22. Build final scoresheet display with totals

## Phase 7: Polish & Deploy
23. Add mobile-responsive styling
24. Implement error handling and reconnection
25. Add game reset functionality
26. Deploy to Vercel

## Key Files Structure
```
/app
  page.tsx                    # Home (create/join)
  create/page.tsx             # Host creates room
  join/page.tsx               # Players join
  room/[code]/page.tsx        # Main game room
/app/api
  socket/route.ts             # Socket.io server
/components
  AuctionControls.tsx         # Host auction setup
  BettingForm.tsx             # Secret bet submission
  HostPositionControls.tsx    # Set car positions
  ScoreReveal.tsx             # Final scores display
  PlayerList.tsx              # Show all players
/lib
  socket.ts                   # Socket client setup
  game-logic.ts               # Payout calculations
  room-manager.ts             # Room state management
/types
  game.ts                     # All TypeScript types
```

## Development Notes
- Keep components small and focused
- Use React Context for socket connection
- Store game state on server, sync to clients
- Mobile-first CSS (players use phones)
- No authentication needed
- Rooms expire after 4 hours of inactivity
