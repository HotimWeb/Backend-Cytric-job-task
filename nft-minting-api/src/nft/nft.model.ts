import { Schema, Document } from 'mongoose';

export const NftSchema = new Schema({
    name: String,
    description: String,
    logoUrl: String,
    nftId: Number,
    userWalletAddress: String,
});

export interface Nft extends Document {
    name: string;
    description: string;
    logoUrl: string;
    nftId: number;
    userWalletAddress: string;
}