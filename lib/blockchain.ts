import type { Block } from "./types";

const ZERO_HASH = "0".repeat(64);

export async function sha256(input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

export async function hashBlock(block: Omit<Block, "currentHash">): Promise<string> {
  return sha256(JSON.stringify({
    index: block.index,
    timestamp: block.timestamp,
    eventType: block.eventType,
    payload: block.payload,
    previousHash: block.previousHash
  }));
}

export async function createBlock(blocks: Block[], eventType: string, payload: Record<string, unknown>): Promise<Block> {
  const previousHash = blocks.at(-1)?.currentHash ?? ZERO_HASH;
  const draft = {
    id: crypto.randomUUID(),
    index: blocks.length,
    timestamp: new Date().toISOString(),
    eventType,
    payload,
    previousHash
  };
  return { ...draft, currentHash: await hashBlock(draft) };
}

export async function verifyChain(blocks: Block[]): Promise<boolean> {
  for (let index = 0; index < blocks.length; index += 1) {
    const block = blocks[index];
    const expectedPrevious = index === 0 ? ZERO_HASH : blocks[index - 1].currentHash;
    const expectedCurrent = await hashBlock(block);
    if (block.previousHash !== expectedPrevious || block.currentHash !== expectedCurrent) return false;
  }
  return true;
}

export function shortHash(hash: string): string {
  return `${hash.slice(0, 10)}...${hash.slice(-7)}`;
}
