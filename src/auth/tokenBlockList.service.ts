import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { blockListTokenEntity } from './entity/blocklist.entity';
import { LessThan, Repository } from 'typeorm';

@Injectable()
export class TokenBlocklistService {
  constructor(
    @InjectRepository(blockListTokenEntity)
    private readonly blocklistRepository: Repository<blockListTokenEntity>,
  ) {}

  async addToken(token: string, expiresAt: Date) {
    const blockedToken = this.blocklistRepository.create({
      token,
      expires_at: expiresAt,
    });
    await this.blocklistRepository.save(blockedToken);
    return {
        message: 'Logout successful',
        
      }
  }

  async isTokenBlocked(token: string): Promise<boolean> {
    const blocked = await this.blocklistRepository.findOne({
      where: { token },
    });
    return !!blocked;
  }

  // Optional: clean up expired tokens regularly
  async cleanExpiredTokens() {
    await this.blocklistRepository.delete({
      expires_at: LessThan(new Date()),
    });
  }
}
