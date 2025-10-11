# 🏎️ Downforce - Digital Scoresheet

A web-based scoring application for the **Downforce** board game with **Odds Betting** variant. Players use their phones/tablets to participate in the auction, place secret bets, and view final scores while playing the physical board game.

## 🎮 What is Downforce?

Downforce is a racing board game where players:
1. **Auction** - Bid on race cars
2. **Bet** - Place secret bets on which cars will finish in top positions (3 betting rounds)
3. **Race** - Move cars around the track (physical board)
4. **Score** - Earn money from owned cars' prize money and successful bets

**Odds Betting Variant**: Bet payouts are calculated as `(Car Position at Bet Time) × (Finish Position Multiplier)`. Betting on cars in last place that win pays more!

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- npm or yarn
- Vercel KV database (for production)

### Installation

```bash
# Install dependencies
npm install

# For local development with Vercel KV
vercel env pull .env.local

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
npm start
```

## 🏗️ Architecture

### Tech Stack
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Storage**: Vercel KV (Redis)
- **State Management**: React hooks + polling
- **Real-time Sync**: HTTP polling (every 2 seconds)
- **i18n**: Custom hook with browser detection
- **Deployment**: Vercel-ready

### Why Polling Instead of WebSockets?
- **Vercel Compatible**: Works on serverless platforms
- **Simple**: No persistent connections to manage
- **Sufficient**: 2-second updates are fast enough for turn-based gameplay
- **Reliable**: No reconnection logic needed

### Why Vercel KV?
- **Serverless Compatible**: Persistent storage across function invocations
- **No Cold Start Issues**: Data persists between requests
- **Auto-Expiration**: 4-hour TTL handles cleanup automatically
- **Simple API**: Redis-compatible with easy integration

## 📁 Project Structure

```
src/
├── app/                          # Next.js App Router pages
│   ├── page.tsx                  # Home (Create/Join room)
│   ├── create/page.tsx           # Host creates room
│   ├── join/page.tsx             # Players join room
│   ├── room/[code]/page.tsx      # Main game room
│   └── api/                      # API routes
│       └── rooms/
│           ├── route.ts          # POST: Create room
│           └── [code]/
│               ├── route.ts      # GET: Get room, POST: Join, PUT: Update
│               ├── claim-car/    # PUT: Claim car in auction
│               └── release-car/  # PUT: Release car in auction
├── components/                   # React components
│   ├── AuctionControls.tsx       # Host: Manage auction
│   ├── PlayerAuctionBid.tsx      # Players: Select cars & bid
│   ├── AuctionDisplay.tsx        # Show auction results
│   ├── HostPositionControls.tsx  # Host: Set car positions
│   ├── BettingForm.tsx           # Players: Place bets
│   ├── MyBets.tsx                # Show player's bets
│   ├── FinalPositionControls.tsx # Host: Set final positions
│   ├── ScoreReveal.tsx           # Final scores & breakdown
│   └── PlayerList.tsx            # Show all players
├── lib/                          # Utilities
│   ├── api.ts                    # API client functions
│   ├── room-manager.ts           # Vercel KV room storage
│   ├── game-logic.ts             # Score calculations
│   └── i18n.ts                   # Internationalization
├── locales/                      # Translation files
│   ├── pt-BR.json                # Portuguese (Brazil) - default
│   └── en.json                   # English
└── types/
    └── game.ts                   # TypeScript types
```

## 🎯 Game Flow

### 1. Room Creation
- Host clicks "Create Room"
- System generates 4-digit room code
- Host shares code with players

### 2. Players Join
- Players enter room code + name
- All players see each other in real-time

### 3. Auction Phase
**Players:**
- Click available cars
- Select bid amount (1-6)
- Can release and reclaim different cars

**Host:**
- Sees real-time car assignments
- Can manually override if needed
- Clicks "Start Betting Phase" when ready

### 4. Betting Rounds (3 rounds)
**Host:**
- Arranges cars in race order (drag with ↑↓ buttons)
- Clicks "Set Positions" to allow betting
- Waits for all players to bet
- Clicks "Next Betting Line" to advance

**Players:**
- See current car positions
- Click a car to place secret bet
- See their previous bets
- Wait for next round

### 5. Race (Physical Board)
Players play the physical board game, moving cars around the track.

### 6. Final Scoring
**Host:**
- Sets final race positions
- Clicks "Finish Race & Show Results"

**Everyone:**
- Sees final leaderboard
- All bets revealed
- Detailed breakdown:
  - Auction costs
  - Racing prize money
  - Betting payouts (with formula)
  - Total winnings

## 🔧 Key Technical Concepts

### State Management
- **Server**: Vercel KV (Redis) storage via `RoomManager` class
- **Client**: Polling every 2 seconds to fetch latest state
- **Updates**: Players send updates via API, server broadcasts to all

### Room Storage
```typescript
// Vercel KV with 4-hour TTL
await kv.set(`room:${code}`, gameState, { ex: 14400 })
await kv.get<GameState>(`room:${code}`)

// Auto-expiration handles cleanup
```

### Game State
```typescript
interface GameState {
  roomCode: string;
  phase: 'auction' | 'betting1' | 'betting2' | 'betting3' | 'finished';
  players: Record<string, Player>;
  cars: Record<CarColor, Car>;
  carOwners: Record<CarColor, string | null>;
  positionsSet?: boolean;
  finalPositions?: Record<CarColor, number>;
}
```

### Odds Betting Formula
```typescript
Payout = (Car Position at Bet Time) × (Finish Multiplier)

Multipliers:
- Bet 1: 1st=3x, 2nd=2x, 3rd=1x
- Bet 2: 1st=2x, 2nd=1x, 3rd=0x
- Bet 3: 1st=1x, 2nd=0x, 3rd=0x

Example:
Bet on car in 6th place (Bet 1)
Car finishes 1st
Payout = 6 × 3 = $18M
```

### Score Calculation
```typescript
Total Winnings = Racing Total + Betting Total - Auction Total

Racing Total = Sum of prize money from owned cars
Betting Total = Sum of all bet payouts
Auction Total = Sum of prices paid for cars
```

## 🎨 UI/UX Decisions

### Mobile-First Design
- Large touch targets
- Grid layouts for car selection
- Button-based inputs (no dropdowns)
- Responsive 2-column grids

### Color-Coded Cars
- Black, Blue, Green, Orange, Red, Yellow
- Consistent color badges throughout
- High contrast text (white/black)

### Real-Time Feedback
- Player status badges (✓ Bet, ⏳ Pending)
- Owned cars shown in player list
- Live auction updates
- Bet confirmation messages

### Host Controls
- Clear separation from player views
- Manual override options
- Validation before advancing phases
- "Set Positions" before betting allowed

## 🌍 Internationalization

### Supported Languages
- **Portuguese (Brazil)** - Default
- **English** - Automatic fallback

### How It Works
```typescript
// Browser language detection
if (navigator.language.startsWith('en')) → English
else → Portuguese (Brazil)

// Usage in components
const t = useTranslations();
<button>{t.auction.startBetting}</button>
```

### Adding New Languages
1. Create `/src/locales/{locale}.json`
2. Add locale to `Locale` type in `/src/lib/i18n.ts`
3. Update `translations` object and detection logic

## 🔐 Security & Validation

### Room Access
- No authentication required
- 4-digit codes (10,000 combinations)
- Rooms auto-expire after 4 hours (KV TTL)

### Conflict Resolution
- **Car Claims**: First request wins
- **Concurrent Updates**: Last write wins
- **Validation**: Host can't advance without all bets

### Data Privacy
- Bets are secret until final reveal
- Data stored in Vercel KV (Redis)
- Auto-deleted after 4 hours

## 🚢 Deployment

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Setup Vercel KV
1. Go to your Vercel project dashboard
2. Navigate to **Marketplace** tab
3. Search for **"Vercel KV"**
4. Click **Add Integration**
5. Select your project and complete setup
6. Environment variables are auto-configured

### Environment Variables
Automatically set by Vercel KV integration:
- `KV_REST_API_URL`
- `KV_REST_API_TOKEN`
- `KV_REST_API_READ_ONLY_TOKEN`
- `KV_URL`

### Limitations
- 4-hour room expiration (configurable in code)
- Vercel KV free tier limits apply

## 🧪 Testing Locally

1. Open multiple browser tabs/windows
2. Create room in tab 1 (host)
3. Join room in tabs 2-4 (players)
4. Test auction, betting, and scoring flows

## 📝 Future Enhancements

- [x] Persistent storage (Vercel KV)
- [x] Internationalization (pt-BR/en)
- [ ] Room history/replay
- [ ] Multiple game variants
- [ ] Player statistics
- [ ] Additional languages (es, fr, de)
- [ ] WebSocket support for faster updates
- [ ] Mobile app (React Native)
- [ ] Dark mode

## 🤝 Contributing

This is a personal project for playing Downforce with friends. Feel free to fork and customize!

## 📄 License

MIT License - Use freely!

## 🎲 Credits

- **Downforce** board game by Rob Daviau & Justin D. Jacobson
- Published by Restoration Games
- This is an unofficial digital scoresheet tool
