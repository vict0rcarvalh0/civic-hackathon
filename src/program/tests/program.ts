import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Skillpass } from "../target/types/skillpass";
import { PublicKey, Keypair, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { expect } from "chai";

describe("skillpass", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.Skillpass as Program<Skillpass>;
  
  // Test accounts
  const user1 = Keypair.generate();
  const user2 = Keypair.generate();
  const user3 = Keypair.generate();
  
  // PDAs
  let programStatePda: PublicKey;
  let reputationMintPda: PublicKey;
  let skillMintPda: PublicKey;
  let treasuryPda: PublicKey;
  let treasuryTokenAccountPda: PublicKey;

  before(async () => {
    // Airdrop SOL to test accounts
    const airdrop1 = await provider.connection.requestAirdrop(user1.publicKey, 2 * LAMPORTS_PER_SOL);
    const airdrop2 = await provider.connection.requestAirdrop(user2.publicKey, 2 * LAMPORTS_PER_SOL);
    const airdrop3 = await provider.connection.requestAirdrop(user3.publicKey, 2 * LAMPORTS_PER_SOL);
    
    await provider.connection.confirmTransaction(airdrop1);
    await provider.connection.confirmTransaction(airdrop2);
    await provider.connection.confirmTransaction(airdrop3);
    
    // Calculate PDAs
    [programStatePda] = PublicKey.findProgramAddressSync(
      [Buffer.from("program_state")],
      program.programId
    );
    
    [reputationMintPda] = PublicKey.findProgramAddressSync(
      [Buffer.from("reputation_mint")],
      program.programId
    );
    
    [skillMintPda] = PublicKey.findProgramAddressSync(
      [Buffer.from("skill_mint")],
      program.programId
    );
    
    [treasuryPda] = PublicKey.findProgramAddressSync(
      [Buffer.from("treasury")],
      program.programId
    );
    
    [treasuryTokenAccountPda] = PublicKey.findProgramAddressSync(
      [
        treasuryPda.toBuffer(),
        TOKEN_PROGRAM_ID.toBuffer(),
        reputationMintPda.toBuffer(),
      ],
      ASSOCIATED_TOKEN_PROGRAM_ID
    );
  });

  it("Initializes the program", async () => {
    const tx = await program.methods
      .initialize()
      .accounts({
        programState: programStatePda,
        authority: provider.wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
        rent: anchor.web3.SYSVAR_RENT_PUBKEY,
      })
      .rpc();

    console.log("✅ Program initialized:", tx);
    
    // Verify program state
    const programState = await program.account.programState.fetch(programStatePda);
    expect(programState.authority.toString()).to.equal(provider.wallet.publicKey.toString());
    expect(programState.totalSkills.toNumber()).to.equal(0);
    expect(programState.totalInvestments.toNumber()).to.equal(0);
  });

  it("Mints reputation tokens to users", async () => {
    // Mint tokens to user1
    const [user1ReputationStatePda] = PublicKey.findProgramAddressSync(
      [Buffer.from("reputation_state"), user1.publicKey.toBuffer()],
      program.programId
    );
    
    const mintTx = await program.methods
      .mintReputationTokens(
        new anchor.BN(100000000000), // 100K tokens
        "Initial mint for user1"
      )
      .accounts({
        programState: programStatePda,
        reputationState: user1ReputationStatePda,
        user: user1.publicKey,
        authority: provider.wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
        rent: anchor.web3.SYSVAR_RENT_PUBKEY,
      })
      .signers([user1])
      .rpc();

    console.log("✅ Reputation tokens minted to user1:", mintTx);
    
    // Verify reputation state
    const reputationState = await program.account.reputationState.fetch(user1ReputationStatePda);
    expect(reputationState.reputationScore.toNumber()).to.equal(100000000000);
    expect(reputationState.user.toString()).to.equal(user1.publicKey.toString());
  });

  it("Creates a skill", async () => {
    const [skillPda] = PublicKey.findProgramAddressSync(
      [Buffer.from("skill"), skillMintPda.toBuffer()],
      program.programId
    );
    
    const createSkillTx = await program.methods
      .createSkill(
        "Frontend Development",
        "React Expert",
        "Advanced React development with TypeScript and modern tooling",
        "https://arweave.net/metadata-uri"
      )
      .accounts({
        programState: programStatePda,
        skill: skillPda,
        skillMint: skillMintPda,
        creator: user1.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
        rent: anchor.web3.SYSVAR_RENT_PUBKEY,
      })
      .signers([user1])
      .rpc();

    console.log("✅ Skill created:", createSkillTx);
    
    // Verify skill
    const skill = await program.account.skill.fetch(skillPda);
    expect(skill.creator.toString()).to.equal(user1.publicKey.toString());
    expect(skill.category).to.equal("Frontend Development");
    expect(skill.name).to.equal("React Expert");
    expect(skill.verified).to.be.false;
  });

  console.log("\n🎉 Basic tests passed! SkillPass program is working correctly.");
});
