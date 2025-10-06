import { VegetableType } from '../entities/Vegetable';
import { HazardType } from '../entities/Hazard';
import { ObstacleType } from '../entities/Obstacle';
import { CollectibleType } from '../entities/Collectible';

export interface LevelData {
  name: string;
  description: string;
  vegetables: Array<{ x: number; y: number; type: VegetableType }>;
  hazards: Array<{ x: number; y: number; type: HazardType }>;
  obstacles: Array<{ x: number; y: number; width: number; height: number; type: ObstacleType }>;
  collectibles: Array<{ x: number; y: number; type: CollectibleType }>;
  requiredSize: number;
  coins: number;
}

export class LevelManager {
  private currentLevel: number = 0;
  private levels: LevelData[] = [];

  constructor() {
    this.initializeLevels();
  }

  private initializeLevels(): void {
    // Level 1: The First Trial - Challenging intro maze
    this.levels.push({
      name: 'Level 1: The First Trial',
      description: 'Master the maze to earn your freedom!',
      vegetables: [
        { x: 120, y: 480, type: 'CARROT' },      // Bottom left chamber
        { x: 680, y: 480, type: 'LETTUCE' },     // Bottom right chamber
        { x: 400, y: 120, type: 'BROCCOLI' },    // Top center chamber
      ],
      hazards: [
        { x: 250, y: 250, type: 'BOMB' },
        { x: 550, y: 350, type: 'BOMB' },
        { x: 400, y: 450, type: 'DYNAMITE' },
      ],
      obstacles: [
        // Create complex S-shaped maze path
        // Top section - force right path
        { x: 0, y: 80, width: 320, height: 20, type: 'WALL' },
        { x: 480, y: 80, width: 320, height: 20, type: 'WALL' },
        { x: 300, y: 80, width: 20, height: 100, type: 'WALL' },

        // Upper-middle - narrow corridor with bomb
        { x: 150, y: 180, width: 200, height: 20, type: 'WALL' },
        { x: 450, y: 180, width: 250, height: 20, type: 'WALL' },
        { x: 150, y: 180, width: 20, height: 120, type: 'WALL' },
        { x: 500, y: 180, width: 20, height: 100, type: 'WALL' },

        // Middle section - zigzag
        { x: 0, y: 280, width: 250, height: 20, type: 'WALL' },
        { x: 350, y: 280, width: 450, height: 20, type: 'WALL' },
        { x: 350, y: 280, width: 20, height: 140, type: 'WALL' },

        // Lower middle - dangerous passage with dynamite
        { x: 200, y: 380, width: 250, height: 20, type: 'WALL' },
        { x: 500, y: 380, width: 150, height: 20, type: 'WALL' },
        { x: 200, y: 380, width: 20, height: 100, type: 'WALL' },
        { x: 630, y: 380, width: 20, height: 100, type: 'WALL' },

        // Bottom chambers
        { x: 0, y: 440, width: 80, height: 20, type: 'WALL' },
        { x: 160, y: 440, width: 470, height: 20, type: 'WALL' },
        { x: 720, y: 440, width: 80, height: 20, type: 'WALL' },
      ],
      collectibles: [
        { x: 600, y: 150, type: 'COIN' },
        { x: 280, y: 350, type: 'COIN' },
        { x: 550, y: 520, type: 'COIN' },
      ],
      requiredSize: 1.8,
      coins: 3
    });

    // Level 2: The Labyrinth - Complex pathfinding
    this.levels.push({
      name: 'Level 2: The Labyrinth',
      description: 'Find your way through the twisted corridors!',
      vegetables: [
        { x: 100, y: 100, type: 'CARROT' },
        { x: 700, y: 100, type: 'PEPPER' },
        { x: 400, y: 500, type: 'BROCCOLI' },
      ],
      hazards: [
        { x: 250, y: 200, type: 'BOMB' },
        { x: 550, y: 300, type: 'DYNAMITE' },
        { x: 350, y: 450, type: 'BOMB' },
      ],
      obstacles: [
        // Complex maze structure
        { x: 0, y: 150, width: 250, height: 20, type: 'WALL' },
        { x: 200, y: 150, width: 20, height: 200, type: 'WALL' },
        { x: 350, y: 80, width: 20, height: 150, type: 'WALL' },
        { x: 350, y: 200, width: 200, height: 20, type: 'WALL' },
        { x: 530, y: 80, width: 20, height: 150, type: 'WALL' },
        { x: 650, y: 150, width: 150, height: 20, type: 'WALL' },
        { x: 100, y: 280, width: 250, height: 20, type: 'WALL' },
        { x: 450, y: 280, width: 250, height: 20, type: 'WALL' },
        { x: 350, y: 320, width: 20, height: 150, type: 'WALL' },
        { x: 150, y: 400, width: 200, height: 20, type: 'WALL' },
        { x: 500, y: 400, width: 200, height: 20, type: 'WALL' },
      ],
      collectibles: [
        { x: 150, y: 250, type: 'COIN' },
        { x: 600, y: 350, type: 'COIN' },
        { x: 250, y: 450, type: 'COIN' },
      ],
      requiredSize: 2.2,
      coins: 3
    });

    // Level 3: Locked Chambers - Key hunt through maze
    this.levels.push({
      name: 'Level 3: Locked Chambers',
      description: 'Find keys hidden in the maze to unlock food chambers!',
      vegetables: [
        { x: 120, y: 120, type: 'BROCCOLI' },
        { x: 680, y: 120, type: 'PEPPER' },
        { x: 400, y: 480, type: 'BROCCOLI' },
      ],
      hazards: [
        { x: 300, y: 250, type: 'DYNAMITE' },
        { x: 500, y: 350, type: 'BOMB' },
      ],
      obstacles: [
        // Locked chambers around vegetables
        { x: 80, y: 80, width: 80, height: 80, type: 'LOCKED_CRATE' },
        { x: 640, y: 80, width: 80, height: 80, type: 'LOCKED_CRATE' },
        { x: 360, y: 440, width: 80, height: 80, type: 'LOCKED_CRATE' },
        // Maze to reach keys
        { x: 250, y: 100, width: 20, height: 200, type: 'WALL' },
        { x: 400, y: 80, width: 20, height: 250, type: 'WALL' },
        { x: 550, y: 100, width: 20, height: 200, type: 'WALL' },
        { x: 150, y: 300, width: 300, height: 20, type: 'WALL' },
        { x: 450, y: 300, width: 250, height: 20, type: 'WALL' },
        { x: 300, y: 380, width: 20, height: 150, type: 'WALL' },
        { x: 500, y: 380, width: 20, height: 150, type: 'WALL' },
      ],
      collectibles: [
        { x: 150, y: 200, type: 'KEY' },
        { x: 650, y: 250, type: 'KEY' },
        { x: 400, y: 350, type: 'KEY' },
        { x: 200, y: 450, type: 'COIN' },
        { x: 600, y: 450, type: 'COIN' },
      ],
      requiredSize: 2.8,
      coins: 5
    });

    // Level 4: Water Works - Navigate around water pools
    this.levels.push({
      name: 'Level 4: Water Works',
      description: 'Cross the flooded maze - careful not to drown!',
      vegetables: [
        { x: 100, y: 100, type: 'PEPPER' },
        { x: 700, y: 100, type: 'BROCCOLI' },
        { x: 100, y: 500, type: 'BROCCOLI' },
        { x: 700, y: 500, type: 'PEPPER' },
      ],
      hazards: [
        { x: 400, y: 180, type: 'BOMB' },
        { x: 400, y: 420, type: 'BOMB' },
      ],
      obstacles: [
        // Water pools creating maze
        { x: 180, y: 150, width: 140, height: 120, type: 'WATER' },
        { x: 480, y: 150, width: 140, height: 120, type: 'WATER' },
        { x: 330, y: 300, width: 140, height: 120, type: 'WATER' },
        { x: 180, y: 450, width: 140, height: 100, type: 'WATER' },
        { x: 480, y: 450, width: 140, height: 100, type: 'WATER' },
        // Safe platforms (rocks)
        { x: 340, y: 200, width: 120, height: 20, type: 'ROCK' },
        { x: 340, y: 380, width: 120, height: 20, type: 'ROCK' },
        // Walls to force path
        { x: 0, y: 200, width: 150, height: 20, type: 'WALL' },
        { x: 650, y: 200, width: 150, height: 20, type: 'WALL' },
        { x: 0, y: 400, width: 150, height: 20, type: 'WALL' },
        { x: 650, y: 400, width: 150, height: 20, type: 'WALL' },
      ],
      collectibles: [
        { x: 400, y: 300, type: 'STAR' },
        { x: 150, y: 300, type: 'COIN' },
        { x: 650, y: 300, type: 'COIN' },
      ],
      requiredSize: 3.2,
      coins: 7
    });

    // Level 5: The Gauntlet - Ultimate maze challenge
    this.levels.push({
      name: 'Level 5: The Gauntlet',
      description: 'Survive the ultimate maze - freedom awaits!',
      vegetables: [
        { x: 120, y: 120, type: 'BROCCOLI' },
        { x: 680, y: 120, type: 'BROCCOLI' },
        { x: 400, y: 300, type: 'BROCCOLI' },
        { x: 120, y: 480, type: 'PEPPER' },
        { x: 680, y: 480, type: 'PEPPER' },
      ],
      hazards: [
        { x: 200, y: 200, type: 'DYNAMITE' },
        { x: 600, y: 200, type: 'DYNAMITE' },
        { x: 300, y: 400, type: 'BOMB' },
        { x: 500, y: 400, type: 'BOMB' },
        { x: 400, y: 500, type: 'DYNAMITE' },
      ],
      obstacles: [
        // Ultimate maze structure
        { x: 80, y: 80, width: 80, height: 80, type: 'LOCKED_CRATE' },
        { x: 640, y: 80, width: 80, height: 80, type: 'LOCKED_CRATE' },
        { x: 80, y: 440, width: 80, height: 80, type: 'LOCKED_CRATE' },
        { x: 640, y: 440, width: 80, height: 80, type: 'LOCKED_CRATE' },
        // Complex wall maze
        { x: 200, y: 100, width: 20, height: 150, type: 'WALL' },
        { x: 350, y: 60, width: 100, height: 20, type: 'WALL' },
        { x: 580, y: 100, width: 20, height: 150, type: 'WALL' },
        { x: 250, y: 230, width: 150, height: 20, type: 'WALL' },
        { x: 400, y: 230, width: 150, height: 20, type: 'WALL' },
        { x: 350, y: 200, width: 100, height: 150, type: 'WATER' },
        { x: 150, y: 330, width: 150, height: 20, type: 'WALL' },
        { x: 500, y: 330, width: 150, height: 20, type: 'WALL' },
        { x: 200, y: 450, width: 20, height: 100, type: 'WALL' },
        { x: 580, y: 450, width: 20, height: 100, type: 'WALL' },
        { x: 350, y: 480, width: 100, height: 20, type: 'WALL' },
      ],
      collectibles: [
        { x: 100, y: 200, type: 'KEY' },
        { x: 700, y: 200, type: 'KEY' },
        { x: 100, y: 400, type: 'KEY' },
        { x: 700, y: 400, type: 'KEY' },
        { x: 250, y: 300, type: 'STAR' },
        { x: 550, y: 300, type: 'STAR' },
        { x: 400, y: 150, type: 'COIN' },
        { x: 400, y: 450, type: 'COIN' },
      ],
      requiredSize: 3.8,
      coins: 10
    });
  }

  public getCurrentLevel(): LevelData {
    return this.levels[this.currentLevel];
  }

  public nextLevel(): boolean {
    if (this.currentLevel < this.levels.length - 1) {
      this.currentLevel++;
      return true;
    }
    return false;
  }

  public getCurrentLevelNumber(): number {
    return this.currentLevel + 1;
  }

  public getTotalLevels(): number {
    return this.levels.length;
  }

  public reset(): void {
    this.currentLevel = 0;
  }
}
