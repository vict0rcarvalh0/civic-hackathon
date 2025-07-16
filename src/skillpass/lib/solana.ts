import { Connection, Commitment, Transaction, PublicKey } from "@solana/web3.js"
import type { SignerWalletAdapter } from "@solana/wallet-adapter-base"

const DEFAULT_COMMITMENT: Commitment = "confirmed"

/* ---------- RPC Endpoints ---------- */

const PRIMARY_RPC =
  process.env.NEXT_PUBLIC_SOLANA_RPC_ENDPOINT ??
  "https://api.mainnet-beta.solana.com"

/**
 * A short ordered list of public RPCs known to allow browser CORS requests.
 * The primary RPC is excluded to avoid duplicates in the fallback chain.
 */
const FALLBACK_RPCS = [
  "https://solana-api.projectserum.com",
  "https://rpc.ankr.com/solana",
  "https://api.mainnet-beta.solana.com",
].filter((u) => u !== PRIMARY_RPC)

/* ---------- Factory helpers ---------- */

/** Preferred connection (from env var or mainnet default). */
export function getSolanaConnection(): Connection {
  return new Connection(PRIMARY_RPC, DEFAULT_COMMITMENT)
}

/** All fallback connections in priority order. */
export function getFallbackSolanaConnections(): Connection[] {
  return FALLBACK_RPCS.map((u) => new Connection(u, DEFAULT_COMMITMENT))
}

/** First fallback connection kept for legacy callers. */
export function getFallbackSolanaConnection(): Connection {
  return getFallbackSolanaConnections()[0]!
}

/* ---------- Robust sender ---------- */

/**
 * Sign and dispatch a transaction, automatically cascading through
 * the primary connection and a list of CORS‑friendly public RPCs until
 * one succeeds. Returns the confirmed signature and whether a fallback
 * RPC was needed.
 */
export async function sendTransactionWithFallback(
  wallet: SignerWalletAdapter,
  tx: Transaction,
  primary: Connection,
): Promise<{ signature: string; usedFallback: boolean }> {
  const connections = [primary, ...getFallbackSolanaConnections()]
  let lastError: unknown

  for (let i = 0; i < connections.length; i++) {
    const conn = connections[i]
    try {
      const {
        blockhash,
        lastValidBlockHeight,
      } = await conn.getLatestBlockhash(DEFAULT_COMMITMENT)

      tx.recentBlockhash = blockhash

      // Ensure wallet is connected before assigning feePayer
      if (!wallet.publicKey) {
        throw new Error("Wallet not connected")
      }
      tx.feePayer = wallet.publicKey as PublicKey

      const signature = await wallet.sendTransaction(tx, conn)
      await conn.confirmTransaction(
        { signature, blockhash, lastValidBlockHeight },
        DEFAULT_COMMITMENT,
      )
      return { signature, usedFallback: i > 0 }
    } catch (err) {
      lastError = err
    }
  }

  throw lastError ?? new Error("All Solana RPC endpoints failed")
}