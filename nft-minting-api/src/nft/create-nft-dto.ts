import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEthereumAddress, IsNumber } from 'class-validator';

export class CreateNftDto {
    @ApiProperty({ description: 'The wallet address of the NFT recipient', example: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e' })
    @IsNotEmpty()
    @IsEthereumAddress()
    to: string;

    @ApiProperty({ description: 'The metadata URL for the NFT', example: 'https://example.com/token-metadata.json' })
    @IsNotEmpty()
    @IsString()
    tokenURI: string;
}

export class GetNftMetadataDto {
    @IsNotEmpty()
    @IsNumber()
    tokenId: number;
}

export class GetNftGalleryDto {
    @IsNotEmpty()
    @IsEthereumAddress()
    walletAddress: string;
}

export class NftMetadataResponseDto {
    owner: string;
    tokenURI: string;
}

export class NftGalleryResponseDto {
    tokenId: number;
    tokenURI: string;
}