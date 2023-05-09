import { Address, BigInt, Bytes } from "@graphprotocol/graph-ts";
import {
    ItemBought as ItemBoughtEvent,
    ItemCanceled as ItemCanceledEvent,
    ItemListed as ItemListedEvent,
} from "../generated/NftMarket/NftMarket";
import { ItemBought, ItemCanceled, ItemListed, ActiveItem } from "../generated/schema";

const zeroAddress = Address.fromString("0x0000000000000000000000000000000000000000");

export function handleItemBought(event: ItemBoughtEvent): void {
    const id = getIdFromEvent(event.params.nftAddress, event.params.tokenId);
    let entity = ItemBought.load(id);
    if (!entity) {
        entity = new ItemBought(id);
    }

    entity.buyer = event.params.buyer;
    entity.nftAddress = event.params.nftAddress;
    entity.tokenId = event.params.tokenId;
    entity.price = event.params.price;

    entity.blockNumber = event.block.number;
    entity.blockTimestamp = event.block.timestamp;
    entity.transactionHash = event.transaction.hash;

    entity.save();

    let activeItem = ActiveItem.load(id);
    activeItem!.buyer = event.params.buyer;
    activeItem!.save();
}

export function handleItemCanceled(event: ItemCanceledEvent): void {
    const id = getIdFromEvent(event.params.nftAddress, event.params.tokenId);
    let entity = new ItemCanceled(id);
    entity.seller = event.params.seller;
    entity.nftAddress = event.params.nftAddress;
    entity.tokenId = event.params.tokenId;

    entity.blockNumber = event.block.number;
    entity.blockTimestamp = event.block.timestamp;
    entity.transactionHash = event.transaction.hash;

    entity.save();

    let activeItem = ActiveItem.load(id);
    activeItem!.seller = zeroAddress;
    activeItem!.save();
}

export function handleItemListed(event: ItemListedEvent): void {
    const id = getIdFromEvent(event.params.nftAddress, event.params.tokenId);
    let entity = ItemListed.load(id);
    if (!entity) {
        entity = new ItemListed(id);
    }
    entity.seller = event.params.seller;
    entity.nftAddress = event.params.nftAddress;
    entity.tokenId = event.params.tokenId;
    entity.price = event.params.price;

    entity.blockNumber = event.block.number;
    entity.blockTimestamp = event.block.timestamp;
    entity.transactionHash = event.transaction.hash;

    entity.save();

    let activeItem = ActiveItem.load(id);
    if (!activeItem) {
        activeItem = new ActiveItem(id);
    }

    activeItem.seller = event.params.seller;
    activeItem.nftAddress = event.params.nftAddress;
    activeItem.tokenId = event.params.tokenId;
    activeItem.price = event.params.price;
    activeItem.buyer = zeroAddress;
    activeItem.save();
}

function getIdFromEvent(nftAddress: Address, tokenId: BigInt): string {
    return tokenId.toHexString() + nftAddress.toHexString();
}
