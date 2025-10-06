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
    // Level 1: Tutorial - Basic collection
    this.levels.push({
      name: 'Level 1: First Meal',
      description: 'Collect vegetables to grow!',
      vegetables: [
        { x: 200, y: 150, type: 'CARROT' },
        { x: 600, y: 150, type: 'CARROT' },
        { x: 400, y: 400, type: 'LETTUCE' },
        { x: 200, y: 450, type: 'LETTUCE' },
      ],
      hazards: [
        { x: 400, y: 250, type: 'BOMB' },
      ],
      obstacles: [
        { x: 300, y: 200, width: 100, height: 20, type: 'WALL' },
        { x: 450, y: 350, width: 80, height: 80, type: 'CRATE' },
      ],
      collectibles: [
        { x: 700, y: 500, type: 'COIN' },
        { x: 100, y: 500, type: 'COIN' },
      ],
      requiredSize: 1.8,
      coins: 2
    });

    // Level 2: Maze challenge
    this.levels.push({
      name: 'Level 2: The Maze',
      description: 'Navigate the maze to find vegetables!',
      vegetables: [
        { x: 150, y: 100, type: 'CARROT' },
        { x: 650, y: 500, type: 'PEPPER' },
        { x: 700, y: 150, type: 'BROCCOLI' },
      ],
      hazards: [
        { x: 400, y: 300, type: 'DYNAMITE' },
        { x: 250, y: 450, type: 'BOMB' },
        { x: 550, y: 200, type: 'BOMB' },
      ],
      obstacles: [
        // Maze walls
        { x: 0, y: 150, width: 300, height: 20, type: 'WALL' },
        { x: 250, y: 150, width: 20, height: 200, type: 'WALL' },
        { x: 450, y: 100, width: 20, height: 300, type: 'WALL' },
        { x: 100, y: 350, width: 200, height: 20, type: 'WALL' },
        { x: 500, y: 250, width: 250, height: 20, type: 'WALL' },
        { x: 600, y: 350, width: 20, height: 200, type: 'WALL' },
      ],
      collectibles: [
        { x: 350, y: 200, type: 'COIN' },
        { x: 500, y: 400, type: 'COIN' },
        { x: 100, y: 250, type: 'COIN' },
      ],
      requiredSize: 2.3,
      coins: 3
    });

    // Level 3: Locked crate puzzle
    this.levels.push({
      name: 'Level 3: Locked Away',
      description: 'Find keys to unlock crates with food!',
      vegetables: [
        { x: 350, y: 200, type: 'BROCCOLI' },
        { x: 650, y: 400, type: 'PEPPER' },
        { x: 150, y: 450, type: 'CARROT' },
      ],
      hazards: [
        { x: 400, y: 350, type: 'DYNAMITE' },
        { x: 200, y: 250, type: 'BOMB' },
        { x: 600, y: 250, type: 'BOMB' },
      ],
      obstacles: [
        { x: 320, y: 170, width: 60, height: 60, type: 'LOCKED_CRATE' },
        { x: 620, y: 370, width: 60, height: 60, type: 'LOCKED_CRATE' },
        { x: 120, y: 420, width: 60, height: 60, type: 'LOCKED_CRATE' },
        { x: 200, y: 100, width: 100, height: 20, type: 'WALL' },
        { x: 500, y: 150, width: 20, height: 150, type: 'WALL' },
      ],
      collectibles: [
        { x: 100, y: 100, type: 'KEY' },
        { x: 700, y: 150, type: 'KEY' },
        { x: 400, y: 500, type: 'KEY' },
        { x: 250, y: 400, type: 'COIN' },
        { x: 550, y: 500, type: 'COIN' },
      ],
      requiredSize: 2.8,
      coins: 5
    });

    // Level 4: Water hazard
    this.levels.push({
      name: 'Level 4: Flooded Cage',
      description: 'Avoid the water! Only large guinea pigs can cross!',
      vegetables: [
        { x: 100, y: 100, type: 'LETTUCE' },
        { x: 700, y: 500, type: 'BROCCOLI' },
        { x: 700, y: 100, type: 'PEPPER' },
        { x: 100, y: 500, type: 'CARROT' },
      ],
      hazards: [
        { x: 400, y: 100, type: 'BOMB' },
        { x: 400, y: 500, type: 'BOMB' },
      ],
      obstacles: [
        { x: 200, y: 200, width: 400, height: 200, type: 'WATER' },
        { x: 50, y: 300, width: 100, height: 80, type: 'ROCK' },
        { x: 650, y: 220, width: 100, height: 80, type: 'ROCK' },
      ],
      collectibles: [
        { x: 400, y: 300, type: 'STAR' },
        { x: 300, y: 150, type: 'COIN' },
        { x: 500, y: 450, type: 'COIN' },
      ],
      requiredSize: 3.2,
      coins: 7
    });

    // Level 5: Final challenge
    this.levels.push({
      name: 'Level 5: The Great Escape!',
      description: 'Navigate all hazards and unlock your freedom!',
      vegetables: [
        { x: 150, y: 150, type: 'BROCCOLI' },
        { x: 650, y: 150, type: 'BROCCOLI' },
        { x: 150, y: 450, type: 'PEPPER' },
        { x: 650, y: 450, type: 'PEPPER' },
        { x: 400, y: 300, type: 'BROCCOLI' },
      ],
      hazards: [
        { x: 250, y: 200, type: 'DYNAMITE' },
        { x: 550, y: 200, type: 'DYNAMITE' },
        { x: 250, y: 400, type: 'BOMB' },
        { x: 550, y: 400, type: 'BOMB' },
        { x: 400, y: 150, type: 'BOMB' },
        { x: 400, y: 450, type: 'BOMB' },
      ],
      obstacles: [
        { x: 100, y: 250, width: 80, height: 80, type: 'LOCKED_CRATE' },
        { x: 620, y: 250, width: 80, height: 80, type: 'LOCKED_CRATE' },
        { x: 350, y: 100, width: 100, height: 20, type: 'WALL' },
        { x: 350, y: 480, width: 100, height: 20, type: 'WALL' },
        { x: 200, y: 280, width: 150, height: 20, type: 'WATER' },
        { x: 450, y: 280, width: 150, height: 20, type: 'WATER' },
      ],
      collectibles: [
        { x: 100, y: 100, type: 'KEY' },
        { x: 700, y: 500, type: 'KEY' },
        { x: 200, y: 500, type: 'STAR' },
        { x: 600, y: 100, type: 'STAR' },
        { x: 400, y: 200, type: 'COIN' },
        { x: 400, y: 400, type: 'COIN' },
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
