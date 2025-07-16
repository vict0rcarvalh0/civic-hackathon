# SkillPass - Decentralized Skills Validation Platform

SkillPass is a blockchain-based platform for validating professional skills through community endorsements backed by reputation staking. Users can showcase their expertise through soulbound NFT credentials while peers stake their reputation to validate skills.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- Docker & Docker Compose
- PostgreSQL (via Docker)

### 1. Environment Setup

Create a `.env` file in the project root:

```bash
# Database
DATABASE_URL="postgresql://skillpass_user:skillpass_password@localhost:5432/skillpass_db"

# Blockchain (Optional - for future integration)
ETHEREUM_RPC_URL="your_ethereum_rpc_url"
PRIVATE_KEY="your_private_key"
SKILL_NFT_CONTRACT="your_deployed_contract_address"
REPUTATION_TOKEN_CONTRACT="your_deployed_contract_address"
SKILL_STAKING_CONTRACT="your_deployed_contract_address"

# Next.js
NEXTAUTH_SECRET="your_nextauth_secret"
NEXTAUTH_URL="http://localhost:3000"
```

### 2. Database Setup

Start PostgreSQL with Docker:
```bash
npm run docker:up
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

### 3. Start Development Server

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

### Endorsements (`endorsements`)
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

### Current Implementation
- ✅ User profiles and reputation system
- ✅ Skills management and categorization
- ✅ Endorsement tracking and validation
- ✅ Real-time leaderboards (skills and users)
- ✅ Dashboard with statistics and activity
- ✅ Dark theme with modern UI/UX
- ✅ Database with comprehensive schema
- ✅ API endpoints for all functionality

### Blockchain Integration (Ready)
- 🔄 Smart contracts for skills NFTs
- 🔄 Reputation token system
- 🔄 Staking and challenge mechanisms
- 🔄 IPFS for metadata storage
- 🔄 Ethereum/Polygon integration

## 📁 Project Structure

```
src/skillpass/
├── app/                          # Next.js App Router
│   ├── api/                      # API routes
│   │   ├── dashboard/            # Dashboard data
│   │   ├── leaderboard/          # Leaderboard data
│   │   └── skills/               # Skills CRUD
│   ├── dashboard/                # Dashboard page
│   ├── leaderboard/              # Leaderboard page
│   └── layout.tsx                # Root layout
├── components/                   # React components
│   ├── ui/                       # shadcn/ui components
│   └── navigation.tsx            # Navigation component
├── lib/                          # Utilities and database
│   ├── db.ts                     # Database schema and client
│   ├── seed.ts                   # Database seed data
│   └── blockchain.ts             # Blockchain integration (ready)
├── scripts/                      # Setup and utility scripts
│   └── setup-db.ts               # Database setup script
├── contracts/                    # Smart contracts
│   ├── SkillNFT.sol             # Skills as NFTs
│   ├── ReputationToken.sol      # Reputation token
│   └── SkillStaking.sol         # Staking and challenges
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

## 🌟 Sample Data

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

### Database
- PostgreSQL on cloud provider (AWS RDS, Vercel Postgres, etc.)
- Update `DATABASE_URL` in production environment

### Application
- Deploy to Vercel, Netlify, or similar platform
- Set environment variables in deployment platform
- Run migrations: `npm run db:migrate`

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Make changes and test thoroughly
4. Ensure database migrations work: `npm run db:reset`
5. Commit changes: `git commit -m 'Add amazing feature'`
6. Push to branch: `git push origin feature/amazing-feature`
7. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- [Live Demo](https://skillpass.vercel.app) (Coming Soon)
- [Documentation](https://docs.skillpass.com) (Coming Soon)
- [Discord Community](https://discord.gg/skillpass) (Coming Soon)

---

Built with ❤️ for the future of professional validation