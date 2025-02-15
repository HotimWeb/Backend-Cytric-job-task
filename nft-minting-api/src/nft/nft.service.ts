import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ethers } from 'ethers';
import { CreateNftDto } from './create-nft-dto'
import { Alchemy, Network } from 'alchemy-sdk';

@Injectable()
export class NftService {
    config = {
        apiKey: "FzwoqYNjfSUKS9wC9UyGNfsNrC0W8NFR",
        network: Network.ETH_SEPOLIA,
    };

    alchemy = new Alchemy(this.config);

    private provider: ethers.JsonRpcProvider;
    private wallet: ethers.Wallet;
    private contract: ethers.Contract;

    contractAddress?: string;

    constructor(private configService: ConfigService) {
        this.provider = new ethers.JsonRpcProvider(
            this.configService.get<string>('BLOCKCHAIN_RPC_URL'),
        );
        this.wallet = new ethers.Wallet(
            this.configService.get<string>('PRIVATE_KEY')!,
            this.provider,
        );

        this.contractAddress = this.configService.get<string>('CONTRACT_ADDRESS')!;
        const contractABI = [
            // ERC-721 ABI 
            'function mintNFT(address to, string memory tokenURI) public returns (uint256)',
            'function ownerOf(uint256 tokenId) public view returns (address)',
            'function tokenURI(uint256 tokenId) public view returns (string memory)',
        ];
        this.contract = new ethers.Contract(this.contractAddress, contractABI, this.wallet);
    }

    /**
     * Mint a new NFT
     * @param createNftDto - NFT data (to address and token URI)
     * @returns Transaction hash
     */
    async mintNFT(createNftDto: CreateNftDto): Promise<string> {
        const { to, tokenURI } = createNftDto;

        try {
            const tx = await this.contract.mintNFT(to, tokenURI);
            await tx.wait();
            return `NFT minted successfully! Transaction Hash: ${tx.hash}`;
        } catch (error) {
            throw new HttpException(
                `Failed to mint NFT: ${error.message}`,
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    /**
     * Get NFT metadata by token ID
     * @param tokenId - NFT token ID
     * @returns NFT metadata (owner and token URI)
     */
    async getNFTMetadata(tokenId: number) {
        try {
            const nft = await this.alchemy.nft.getNftMetadata(this.contractAddress!, tokenId);
            // const owner = await this.contract.ownerOf(tokenId);
            // const tokenURI = await this.contract.tokenURI(tokenId);
            return nft;
        } catch (error) {
            throw new HttpException(
                `Failed to fetch NFT metadata: ${error.message}`,
                HttpStatus.NOT_FOUND,
            );
        }
    }

    /**
     * Get all NFTs owned by a specific wallet address
     * @param walletAddress - Wallet address
     * @returns List of NFT metadata
     */
    async getNFTsByWallet(walletAddress: string) {
        try {
            const res = await this.alchemy.nft.getNftsForOwner(walletAddress)
            return res.ownedNfts;
        } catch (error) {
            throw new HttpException(
                `Failed to fetch NFTs for wallet: ${error.message}`,
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }
}