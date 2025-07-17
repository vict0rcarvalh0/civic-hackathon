# SkillPass - Decentralized Skills Validation & Investment Platform

SkillPass is a blockchain-based platform for validating professional skills through community endorsements backed by reputation staking. Users can showcase their expertise through soulbound NFT credentials while peers stake their reputation to validate skills and **earn real yield from skill owner job revenue**.

## Real Problem

- In Web3 or freelance environments, it's hard to know if someone is trustworthy.
- "Proving" knowledge depends on screenshots or portfolio links.
- Recommendations/references are centralized and unverifiable.
- Freelancers face distrust on platforms like Fiverr and Upwork.
- **No financial incentive for skill validators - just social proof.**

---

## Solution: SkillPass 

Credential and endorsement system with third-party reputation staking **plus real investment returns**.

---

## Use Cases

- Web3 devs validating technical knowledge with community backing.
- Translation, design, writing—where social proof matters more than a diploma.
- Mentors endorsing mentees with skin in the game.
- Web3 communities filtering who is reputable based on social staking.
- **Investors earning 15-45% APY from skill owner job completions.**

### How it works

1. User logs in with Civic Auth and creates their profile.
2. Adds skills (e.g., React, Solana dev, designer, translator, etc.).
3. Other users can "invest" in a skill, staking REPR tokens to validate.
4. **Skill owners complete jobs → 7% of revenue shared with investors.**
5. **Investors earn monthly yield from real skill monetization.**
6. Profiles get a dynamic social/professional score, publicly visible.
7. Everything is recorded in a soulbound NFT with validated skills and endorsements.


## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- Docker & Docker Compose
- MetaMask: Users need MetaMask for blockchain interactions
- Sepolia Network: App automatically prompts network switching

### 1. Clone the repository:
```bash
git clone https://github.com/vict0rcarvalh0/civic-hackathon.git
cd src/skillpass
```
### 2. Install dependencies:
This project has some peer dependency conflicts. Use the --force flag to resolve them.

```bash
npm install --legacy-peer-deps
```

### 3. Set up environment variables:
The application requires several environment variables to run correctly.

- Copy the example environment file:
```bash
    cp .env.example .env
```

- Get a Civic Client ID: You need to register your application with Civic to get a Client ID. You can sign up at auth.civic.com.

- Open the .env file and replace YOUR_CIVIC_CLIENT_ID_HERE with your actual Civic Client ID. 

### 4. Database Setup

Start PostgreSQL with Docker:
```bash
sudo docker-compose up -d
```

Set up database schema and seed data:
```bash
npm run db:setup
```

This will:
- Install dependencies
- Generate Drizzle migrations
- Create database tables
- Seed with sample users, skills, and endorsements

### 5. Start Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see your application.

## 📊 Database Schema

### Users (`user_profiles`)
- Profile information (display name, bio, avatar)
- Reputation metrics (score, skills count, endorsements)
- Social links (website, Twitter, LinkedIn)

### Skills (`skills`)
- Skill metadata (name, description, category)
- Blockchain data (token ID, contract address, transaction hash)
- Validation status (pending, minted, verified)
- Evidence (portfolio links, certificates, testimonials)

### Investments (`investments`) **NEW**
- Investment tracking (amount, expected yield, APY)
- Earnings data (total earned, claimed, pending)
- Performance metrics (jobs completed, monthly revenue)
- Risk assessment and blockchain transaction data

### Endorsements (`endorsements`) **LEGACY**
- Staking information (amount staked, endorser details)
- Evidence and reasoning
- Blockchain transaction data
- Challenge/resolution status

### Challenges (`challenges`)
- Dispute mechanism for skill validation
- Evidence submission and resolution
- Community governance

## 🗄️ Available Scripts

### Database Management
```bash
npm run docker:up          # Start PostgreSQL container
npm run docker:down        # Stop PostgreSQL container
npm run docker:logs        # View PostgreSQL logs

npm run db:generate        # Generate Drizzle migrations
npm run db:migrate         # Apply migrations to database
npm run db:seed           # Seed database with sample data
npm run db:setup          # Complete setup (migrate + seed)
npm run db:reset          # Drop database and rebuild
npm run db:studio         # Open Drizzle Studio (database GUI)
```

### Development
```bash
npm run dev               # Start development server
npm run build             # Build for production
npm run start             # Start production server
npm run lint              # Run ESLint
```

## 🏗️ Architecture

### Frontend
- **Next.js 14** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **shadcn/ui** component library
- **Dark theme** with glass morphism design

### Backend
- **Next.js API Routes** for server logic
- **Drizzle ORM** for database operations
- **PostgreSQL** for data persistence
- **Future blockchain integration** ready

### Database
- **PostgreSQL** with comprehensive schema
- **Drizzle migrations** for version control
- **Seed data** for development and testing

## 🎯 Features
- User profiles and reputation system
- Skills management and categorization  
- **Investment platform with real APY (15-45%)**
- **Smart contracts deployed on Sepolia testnet**
- **REPR token integration with MetaMask**
- **NFT minting for skills**
- **Revenue sharing from job completions**
- Real-time leaderboards (skills and users)
- Dashboard with statistics and activity
- Dark theme with modern UI/UX
- Database with comprehensive schema
- API endpoints for all functionality
- **Civic Auth Web3 integration**

## 📁 Project Structure

```
src/skillpass/
├── app/                          # Next.js App Router
│   ├── api/                      # API routes
│   │   ├── dashboard/            # Dashboard data
│   │   ├── investments/          # Investment platform APIs
│   │   ├── skills/               # Skills CRUD & endorsable
│   │   └── auth/                 # Civic Auth integration
│   ├── dashboard/                # Dashboard pages
│   │   ├── invest/               # Investment interface
│   │   └── analytics/            # Investment analytics
│   └── layout.tsx                # Root layout with Civic Auth
├── components/                   # React components
│   ├── ui/                       # shadcn/ui components
│   ├── skill-detail-dialog.tsx  # Investment skill details
│   └── navigation.tsx            # Navigation component
├── lib/                          # Utilities and integrations
│   ├── db.ts                     # Database schema (includes investments)
│   ├── web3.ts                   # Smart contract integration
│   ├── contracts.ts              # Contract addresses & ABIs
│   └── seed.ts                   # Database seed data
├── scripts/                      # Setup and utility scripts
├── contracts/                    # Smart contracts (Foundry)
│   ├── src/
│   │   ├── SkillNFT.sol         # Skills as NFTs
│   │   ├── ReputationToken.sol  # REPR token
│   │   └── SkillRevenue.sol     # Investment platform
│   ├── script/                   # Deployment scripts
│   └── DEPLOYMENT.md             # Contract deployment guide
└── docker-compose.yml            # PostgreSQL setup
```

## 🔧 Development Workflow

### Adding New Features

1. **Database Changes**: Update schema in `lib/db.ts`
2. **API Endpoints**: Create routes in `app/api/`
3. **Frontend Components**: Add components in `components/`
4. **Pages**: Create pages in `app/`
5. **Migrations**: Run `npm run db:generate` for schema changes

### Testing Database Changes

1. Reset database: `npm run db:reset`
2. Test with fresh seed data
3. Verify API endpoints work correctly
4. Test frontend integration

## Sample Data

The database comes pre-seeded with:

- **6 Sample Users** with diverse profiles and expertise
- **11 Skills** across different categories (Frontend, AI/ML, Design, DevOps, etc.)
- **24+ Endorsements** showing cross-validation between users
- **Realistic Data** including reputation scores, staking amounts, and evidence

### Sample Users
- Sarah Chen (Full-stack Developer) - 9.8 reputation
- Mike Johnson (ML Engineer) - 9.6 reputation  
- Emma Wilson (UX Designer) - 9.4 reputation
- David Kim (DevOps Engineer) - 9.3 reputation
- Lisa Rodriguez (Product Manager) - 9.1 reputation
- Alex Thompson (Smart Contract Developer) - 8.9 reputation

## 🚀 Deployment

### **Live on Sepolia Testnet**

The SkillPass investment platform is **live and functional** on Sepolia testnet:

- **Frontend**: Full investment interface operational
- **Smart Contracts**: Deployed and verified on Sepolia
- **Database**: PostgreSQL with investment tracking
- **Blockchain Integration**: REPR tokens, NFT minting, revenue sharing

**To test the platform:**
1. Connect MetaMask to Sepolia testnet
2. Get Sepolia ETH from [faucets](https://sepoliafaucet.com/)
3. The app will mint you 1M REPR tokens automatically
4. Create skills, invest in skills, earn real APY!

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- [Live Demo](https://www.youtube.com/watch?v=wzw4u-9rCZg)