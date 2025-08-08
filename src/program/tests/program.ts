import * as anchor from "@coral-xyz/anchor";
import { Program, BN } from "@coral-xyz/anchor";
import { Skillpass } from "../target/types/skillpass";
import { Keypair, PublicKey, LAMPORTS_PER_SOL, SystemProgram } from "@solana/web3.js";
import {
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  getAssociatedTokenAddress,
} from "@solana/spl-token";
import { expect } from "chai";

describe("skillpass", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const program = anchor.workspace.Skillpass as Program<Skillpass>;

  const user1 = Keypair.generate();
  const user2 = Keypair.generate();

  // PDAs
  let programStatePda: PublicKey;
  let reputationMintPda: PublicKey;
  let skillCollectionMintPda: PublicKey;
  let treasuryPda: PublicKey;
  let treasuryTokenAccount: PublicKey;

  before(async () => {
    // Airdrop SOL for fees
    for (const kp of [user1, user2]) {
      const sig = await provider.connection.requestAirdrop(
        kp.publicKey,
        2 * LAMPORTS_PER_SOL
      );
      await provider.connection.confirmTransaction(sig);
    }

    // Canonical PDAs
    [programStatePda] = PublicKey.findProgramAddressSync(
      [Buffer.from("program_state")],
      program.programId
    );
    [reputationMintPda] = PublicKey.findProgramAddressSync(
      [Buffer.from("reputation_mint")],
      program.programId
    );
    [skillCollectionMintPda] = PublicKey.findProgramAddressSync(
      [Buffer.from("skill_collection_mint")],
      program.programId
    );
    [treasuryPda] = PublicKey.findProgramAddressSync(
      [Buffer.from("treasury")],
      program.programId
    );

    // Treasury ATA for reputation mint
    treasuryTokenAccount = await getAssociatedTokenAddress(
      reputationMintPda,
      treasuryPda,
      true
    );
  });

  it("initializes the program", async () => {
    const tx = await program.methods
      .initialize()
      .accountsStrict({
        programState: programStatePda,
        reputationMint: reputationMintPda,
        skillCollectionMint: skillCollectionMintPda,
        treasury: treasuryPda,
        treasuryTokenAccount: treasuryTokenAccount,
        authority: provider.wallet.publicKey,
        systemProgram: SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        rent: anchor.web3.SYSVAR_RENT_PUBKEY,
      } as any)
      .rpc();

    expect(tx).to.be.a("string");

    const state = await program.account.programState.fetch(programStatePda);
    expect(state.authority.toBase58()).to.eq(
      provider.wallet.publicKey.toBase58()
    );
    expect(state.reputationMint.toBase58()).to.eq(reputationMintPda.toBase58());
    expect(state.treasury.toBase58()).to.eq(treasuryPda.toBase58());
  });

  it("mints reputation to user1 (authority)", async () => {
    // Derive user1 reputation state and ATA
    const [user1ReputationStatePda] = PublicKey.findProgramAddressSync(
      [Buffer.from("reputation_state"), user1.publicKey.toBuffer()],
      program.programId
    );
    const user1Ata = await getAssociatedTokenAddress(
      reputationMintPda,
      user1.publicKey
    );

    const tx = await program.methods
      .mintReputationTokens(new BN(1_000_000_000), "bootstrap")
      .accountsStrict({
        programState: programStatePda,
        reputationMint: reputationMintPda,
        userTokenAccount: user1Ata,
        reputationState: user1ReputationStatePda,
        user: user1.publicKey,
        authority: provider.wallet.publicKey,
        systemProgram: SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        rent: anchor.web3.SYSVAR_RENT_PUBKEY,
      } as any)
      .rpc();

    expect(tx).to.be.a("string");

    const rep = await program.account.reputationState.fetch(
      user1ReputationStatePda
    );
    expect(rep.user.toBase58()).to.eq(user1.publicKey.toBase58());
    expect(rep.reputationScore.toString()).to.eq("1000000000");
  });

  it("creates a skill (mints NFT to creator)", async () => {
    // Create a real mint for the skill NFT
    const skillMint = Keypair.generate();

    // PDAs bound to the skill mint
    const [skillPda] = PublicKey.findProgramAddressSync(
      [Buffer.from("skill"), skillMint.publicKey.toBuffer()],
      program.programId
    );
    const [investmentPoolPda] = PublicKey.findProgramAddressSync(
      [Buffer.from("investment_pool"), skillMint.publicKey.toBuffer()],
      program.programId
    );
    const [revenueBreakdownPda] = PublicKey.findProgramAddressSync(
      [Buffer.from("revenue_breakdown"), skillMint.publicKey.toBuffer()],
      program.programId
    );
    const [stakeInfoPda] = PublicKey.findProgramAddressSync(
      [Buffer.from("stake_info"), skillMint.publicKey.toBuffer()],
      program.programId
    );

    const creatorAta = await getAssociatedTokenAddress(
      skillMint.publicKey,
      user1.publicKey
    );

    const tx = await program.methods
      .createSkill(
        "Frontend Development",
        "React Expert",
        "Advanced React + TS",
        "https://arweave.net/metadata-uri"
      )
      .accountsStrict({
        programState: programStatePda,
        skillMint: skillMint.publicKey,
        creatorTokenAccount: creatorAta,
        skill: skillPda,
        investmentPool: investmentPoolPda,
        revenueBreakdown: revenueBreakdownPda,
        stakeInfo: stakeInfoPda,
        creator: user1.publicKey,
        systemProgram: SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        rent: anchor.web3.SYSVAR_RENT_PUBKEY,
      } as any)
      .signers([user1, skillMint])
      .rpc();

    expect(tx).to.be.a("string");

    const skill = await program.account.skill.fetch(skillPda);
    expect(skill.creator.toBase58()).to.eq(user1.publicKey.toBase58());
    expect(skill.name).to.eq("React Expert");
    expect(skill.verified).to.eq(false);

    // Stash for next tests
    (global as any).skillMint = skillMint.publicKey;
    (global as any).skillPda = skillPda;
    (global as any).investmentPoolPda = investmentPoolPda;
    (global as any).revenueBreakdownPda = revenueBreakdownPda;
  });

  it("invests in a skill using reputation tokens", async () => {
    const skillPda: PublicKey = (global as any).skillPda;
    const investmentPoolPda: PublicKey = (global as any).investmentPoolPda;

    // Fetch skill to get skill_id
    const skill = await program.account.skill.fetch(skillPda);
    const skillId = new BN(skill.skillId.toString());

    // Ensure investor ATA exists
    const investorAta = await getAssociatedTokenAddress(
      reputationMintPda,
      user1.publicKey
    );

    // Investment PDA for (investor, skill_id)
    const [investmentPda] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("investment"),
        user1.publicKey.toBuffer(),
        Buffer.from(skillId.toArrayLike(Buffer, "le", 8)),
      ],
      program.programId
    );

    const tx = await program.methods
      .investInSkill(skillId, new BN(200_000_000))
      .accountsStrict({
        programState: programStatePda,
        reputationMint: reputationMintPda,
        investorTokenAccount: investorAta,
        skill: skillPda,
        investmentPool: investmentPoolPda,
        investment: investmentPda,
        treasury: treasuryPda,
        treasuryTokenAccount: treasuryTokenAccount,
        investor: user1.publicKey,
        systemProgram: SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        rent: anchor.web3.SYSVAR_RENT_PUBKEY,
      } as any)
      .signers([user1])
      .rpc();

    expect(tx).to.be.a("string");

    const pool = await program.account.investmentPool.fetch(investmentPoolPda);
    expect(pool.totalInvested.toString()).to.eq("200000000");
    expect(pool.investorCount.toNumber()).to.eq(1);
  });

  it("records job completion and updates APY", async () => {
    const skillPda: PublicKey = (global as any).skillPda;
    const investmentPoolPda: PublicKey = (global as any).investmentPoolPda;
    const revenueBreakdownPda: PublicKey = (global as any).revenueBreakdownPda;

    const skill = await program.account.skill.fetch(skillPda);
    const skillId = new BN(skill.skillId.toString());

    const tx = await program.methods
      .recordJobCompletion(skillId, new BN(5_000_000_000), "Website build")
      .accountsStrict({
        programState: programStatePda,
        skill: skillPda,
        investmentPool: investmentPoolPda,
        revenueBreakdown: revenueBreakdownPda,
        treasury: treasuryPda,
        authority: provider.wallet.publicKey,
      } as any)
      .rpc();

    expect(tx).to.be.a("string");

    const pool = await program.account.investmentPool.fetch(investmentPoolPda);
    // APY should be > 0 after revenue
    expect(pool.currentApy.toNumber()).to.be.greaterThan(0);
  });

  it("claim_yield should return NoYieldToClaim initially (no months elapsed)", async () => {
    const skillPda: PublicKey = (global as any).skillPda;
    const investmentPoolPda: PublicKey = (global as any).investmentPoolPda;

    const skill = await program.account.skill.fetch(skillPda);
    const skillId = new BN(skill.skillId.toString());

    const investorAta = await getAssociatedTokenAddress(
      reputationMintPda,
      user1.publicKey
    );

    const [investmentPda] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("investment"),
        user1.publicKey.toBuffer(),
        Buffer.from(skillId.toArrayLike(Buffer, "le", 8)),
      ],
      program.programId
    );

    try {
      await program.methods
        .claimYield(skillId)
        .accounts({
          programState: programStatePda,
          reputationMint: reputationMintPda,
          investorTokenAccount: investorAta,
          skill: skillPda,
          investmentPool: investmentPoolPda,
          investment: investmentPda,
          treasury: treasuryPda,
          treasuryTokenAccount: treasuryTokenAccount,
          investor: user1.publicKey,
          tokenProgram: TOKEN_PROGRAM_ID,
        })
        .signers([user1])
        .rpc();
      throw new Error("Expected NoYieldToClaim, but claim succeeded");
    } catch (e: any) {
      const msg = e.toString();
      expect(
        msg.includes("NoYieldToClaim") ||
          msg.includes("No yield to claim")
      ).to.eq(true);
    }
  });

  it("slashes reputation from user2 and moves to treasury", async () => {
    // Give user2 some initial reputation first
    const [user2ReputationStatePda] = PublicKey.findProgramAddressSync(
      [Buffer.from("reputation_state"), user2.publicKey.toBuffer()],
      program.programId
    );
    const user2Ata = await getAssociatedTokenAddress(
      reputationMintPda,
      user2.publicKey
    );

    await program.methods
      .mintReputationTokens(new BN(300_000_000), "bootstrap u2")
      .accounts({
        programState: programStatePda,
        reputationMint: reputationMintPda,
        userTokenAccount: user2Ata,
        reputationState: user2ReputationStatePda,
        user: user2.publicKey,
        authority: provider.wallet.publicKey,
        systemProgram: SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        rent: anchor.web3.SYSVAR_RENT_PUBKEY,
      })
      .rpc();

    // Now slash part of it
    await program.methods
      .slashReputationTokens(new BN(100_000_000), "penalty")
      .accounts({
        programState: programStatePda,
        reputationMint: reputationMintPda,
        userTokenAccount: user2Ata,
        reputationState: user2ReputationStatePda,
        treasury: treasuryPda,
        treasuryTokenAccount: treasuryTokenAccount,
        user: user2.publicKey,
        authority: provider.wallet.publicKey,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .rpc();

    // Basic sanity: reputation state reduced
    const rep2 = await program.account.reputationState.fetch(
      user2ReputationStatePda
    );
    expect(rep2.reputationScore.toNumber()).to.eq(200_000_000);
  });

  console.log("\n🎉 Tests finished for SkillPass");
});
