import { promises as fs } from "fs"
import path from "path"

const dataDir = path.join(process.cwd(), "data")
const walletsFile = path.join(dataDir, "wallets.json")

interface WalletEntry {
  userId: string
  chain: string
  address: string
}

async function ensureFile() {
  await fs.mkdir(dataDir, { recursive: true })
  try {
    await fs.access(walletsFile)
  } catch {
    await fs.writeFile(walletsFile, "[]")
  }
}

async function readAll(): Promise<WalletEntry[]> {
  await ensureFile()
  const raw = await fs.readFile(walletsFile, "utf8")
  if (!raw.trim()) return []
  try {
    return JSON.parse(raw) as WalletEntry[]
  } catch (err) {
    console.error("wallets.json corrupted – backing up and resetting", err)
    try {
      const backup = `${walletsFile}.${Date.now()}.bak`
      await fs.writeFile(backup, raw)
    } catch {}
    await fs.writeFile(walletsFile, "[]")
    return []
  }
}

// Serialise writes to prevent concurrent corruption
let writeChain: Promise<void> = Promise.resolve()

async function writeAll(entries: WalletEntry[]) {
  writeChain = writeChain.then(async () => {
    const tmp = `${walletsFile}.tmp`
    await fs.writeFile(tmp, JSON.stringify(entries, null, 2))
    await fs.rename(tmp, walletsFile)
  })
  return writeChain
}

export async function getWalletByUser(
  userId: string,
  chain = "solana",
): Promise<string | null> {
  const list = await readAll()
  const found = list.find((w) => w.userId === userId && w.chain === chain)
  return found ? found.address : null
}

export async function saveWalletForUser(
  userId: string,
  address: string,
  chain = "solana",
) {
  const list = await readAll()
  const idx = list.findIndex((w) => w.userId === userId && w.chain === chain)
  if (idx === -1) {
    list.push({ userId, chain, address })
  } else {
    list[idx].address = address
  }
  await writeAll(list)
}