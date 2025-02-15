import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { NftService } from './nft.service';
import { ApiOperation, ApiResponse, ApiTags, ApiBody, ApiParam } from '@nestjs/swagger';
import { CreateNftDto } from './create-nft-dto';

@ApiTags('nft')
@Controller('nft')
export class NftController {
    constructor(private readonly nftService: NftService) { }

    @Post('mint')
    @ApiOperation({ summary: 'Mint a new NFT' })
    @ApiBody({ type: CreateNftDto, description: 'Data required to mint an NFT' })
    @ApiResponse({ status: 201, description: 'NFT minted successfully' })
    @ApiResponse({ status: 500, description: 'Failed to mint NFT' })
    async mintNFT(@Body() createNftDto: CreateNftDto): Promise<string> {
        return this.nftService.mintNFT(createNftDto);
    }

    @Get('metadata/:tokenId')
    @ApiOperation({ summary: 'Get NFT metadata by token ID' })
    @ApiParam({ name: 'tokenId', type: Number, description: 'The ID of the NFT' })
    @ApiResponse({ status: 200, description: 'NFT metadata retrieved successfully' })
    @ApiResponse({ status: 404, description: 'NFT not found' })
    async getNFTMetadata(@Param('tokenId') tokenId: number) {
        return this.nftService.getNFTMetadata(tokenId);
    }

    @Get('gallery/:walletAddress')
    @ApiOperation({ summary: 'Get all NFTs owned by a wallet address' })
    @ApiParam({ name: 'walletAddress', type: String, description: 'The wallet address of the NFT owner' })
    @ApiResponse({ status: 200, description: 'List of NFTs retrieved successfully' })
    @ApiResponse({ status: 500, description: 'Failed to fetch NFTs' })
    async getNFTsByWallet(@Param('walletAddress') walletAddress: string) {
        return this.nftService.getNFTsByWallet(walletAddress);
    }
}