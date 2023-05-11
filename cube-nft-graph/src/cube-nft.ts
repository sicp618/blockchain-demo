import { Address, BigInt, Bytes } from "@graphprotocol/graph-ts";
import {
  Approval as ApprovalEvent,
  ApprovalForAll as ApprovalForAllEvent,
  CubeMintd as CubeMintdEvent,
  Transfer as TransferEvent,
} from "../generated/CubeNft/CubeNft";
import {
  Approval,
  ApprovalForAll,
  CubeMintd,
  Transfer,
  NftInfo,
} from "../generated/schema";

export function handleApproval(event: ApprovalEvent): void {
  let entity = new Approval(
    event.transaction.hash.concatI32(event.logIndex.toI32()).toHexString()
  );
  
  entity.owner = event.params.owner;
  entity.approved = event.params.approved;
  entity.tokenId = event.params.tokenId;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleApprovalForAll(event: ApprovalForAllEvent): void {
  let entity = new ApprovalForAll(
    event.transaction.hash.concatI32(event.logIndex.toI32()).toHexString()
  );
  entity.owner = event.params.owner;
  entity.operator = event.params.operator;
  entity.approved = event.params.approved;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleCubeMintd(event: CubeMintdEvent): void {
  let entity = new CubeMintd(
    event.transaction.hash.concatI32(event.logIndex.toI32()).toHexString()
  );
  entity.tokenId = event.params.tokenId;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleTransfer(event: TransferEvent): void {
  let entity = new Transfer(
    event.transaction.hash.concatI32(event.logIndex.toI32()).toHexString()
  );
  entity.from = event.params.from;
  entity.to = event.params.to;
  entity.tokenId = event.params.tokenId;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();

  let nftInfo = NftInfo.load(getIdFromEvent(event.params.tokenId));
  if (nftInfo == null) {
    nftInfo = new NftInfo(getIdFromEvent(event.params.tokenId));
  }
  nftInfo.from = event.params.from;
  nftInfo.to = event.params.to;
  nftInfo.tokenId = event.params.tokenId;
  nftInfo.save();
}

export function getIdFromEvent(tokenId: BigInt): string {
  return tokenId.toHexString();
}
