import { VegetableType } from '../entities/Vegetable';
import { HazardType } from '../entities/Hazard';
import { ObstacleType } from '../entities/Obstacle';
import { CollectibleType } from '../entities/Collectible';
import { EnemyType } from '../entities/Enemy';
import { PowerUpType } from '../entities/PowerUp';

export interface LevelData {
  name: string;
  description: string;
  vegetables: Array<{ x: number; y: number; type: VegetableType }>;
  hazards: Array<{ x: number; y: number; type: HazardType }>;
  obstacles: Array<{ x: number; y: number; width: number; height: number; type: ObstacleType }>;
  collectibles: Array<{ x: number; y: number; type: CollectibleType }>;
  enemies: Array<{ x: number; y: number; type: EnemyType; waypoints: Array<{ x: number; y: number }> }>;
  powerups: Array<{ x: number; y: number; type: PowerUpType }>;
  requiredSize: number;
  coins: number;
  timeLimit?: number; // seconds, undefined means no limit
  boss?: boolean; // is this a boss level?
}

export class LevelManager {
  private currentLevel: number = 0;
  private levels: LevelData[] = [];

  constructor() {
    this.initializeLevels();
  }

  private initializeLevels(): void {
    // Level 1: CAT PATROL - Stealth and Speed!
    this.levels.push({
      name: 'Level 1: CAT PATROL',
      description: 'Sneak past the hunting cats! Collect veggies to grow!',
      vegetables: [
        { x: 120, y: 480, type: 'CARROT' },
        { x: 680, y: 480, type: 'LETTUCE' },
        { x: 400, y: 120, type: 'BROCCOLI' },
        { x: 200, y: 300, type: 'CARROT' },
      ],
      hazards: [
        { x: 400, y: 250, type: 'BOMB' },
        { x: 600, y: 350, type: 'DYNAMITE' },
      ],
      obstacles: [
        // Maze structure
        { x: 0, y: 80, width: 320, height: 20, type: 'WALL' },
        { x: 480, y: 80, width: 320, height: 20, type: 'WALL' },
        { x: 150, y: 180, width: 200, height: 20, type: 'WALL' },
        { x: 450, y: 180, width: 250, height: 20, type: 'WALL' },
        { x: 350, y: 280, width: 20, height: 140, type: 'WALL' },
        { x: 200, y: 380, width: 250, height: 20, type: 'WALL' },
        { x: 500, y: 380, width: 150, height: 20, type: 'WALL' },
        // Safe zones
        { x: 50, y: 450, width: 60, height: 60, type: 'ROCK' },
        { x: 690, y: 450, width: 60, height: 60, type: 'ROCK' },
      ],
      collectibles: [
        { x: 600, y: 150, type: 'COIN' },
        { x: 280, y: 350, type: 'COIN' },
      ],
      enemies: [
        // Cats patrolling key corridors
        { x: 400, y: 200, type: 'CAT', waypoints: [
          { x: 250, y: 200 }, { x: 550, y: 200 }
        ]},
        { x: 500, y: 400, type: 'CAT', waypoints: [
          { x: 300, y: 400 }, { x: 600, y: 400 }
        ]},
      ],
      powerups: [
        { x: 100, y: 150, type: 'SPEED' },
        { x: 700, y: 300, type: 'SHIELD' },
      ],
      requiredSize: 2.0,
      coins: 2,
      timeLimit: 90
    });

    // Level 2: SNAKE PIT - Dodge the Serpents!
    this.levels.push({
      name: 'Level 2: SNAKE PIT',
      description: 'Deadly snakes guard the peppers! Quick thinking required!',
      vegetables: [
        { x: 100, y: 100, type: 'PEPPER' },
        { x: 700, y: 100, type: 'PEPPER' },
        { x: 400, y: 300, type: 'BROCCOLI' },
        { x: 100, y: 500, type: 'BROCCOLI' },
        { x: 700, y: 500, type: 'CARROT' },
      ],
      hazards: [
        { x: 250, y: 200, type: 'DYNAMITE' },
        { x: 550, y: 400, type: 'DYNAMITE' },
        { x: 400, y: 450, type: 'BOMB' },
      ],
      obstacles: [
        // Water hazards creating challenge
        { x: 180, y: 150, width: 140, height: 100, type: 'WATER' },
        { x: 480, y: 150, width: 140, height: 100, type: 'WATER' },
        { x: 330, y: 350, width: 140, height: 120, type: 'WATER' },
        // Safe platforms
        { x: 340, y: 250, width: 120, height: 20, type: 'ROCK' },
        { x: 250, y: 400, width: 80, height: 20, type: 'ROCK' },
        { x: 470, y: 400, width: 80, height: 20, type: 'ROCK' },
      ],
      collectibles: [
        { x: 150, y: 250, type: 'STAR' },
        { x: 650, y: 350, type: 'COIN' },
        { x: 400, y: 500, type: 'COIN' },
      ],
      enemies: [
        // Snakes slithering through corridors
        { x: 200, y: 300, type: 'SNAKE', waypoints: [
          { x: 150, y: 200 }, { x: 150, y: 400 }
        ]},
        { x: 600, y: 300, type: 'SNAKE', waypoints: [
          { x: 650, y: 200 }, { x: 650, y: 400 }
        ]},
        { x: 400, y: 200, type: 'SNAKE', waypoints: [
          { x: 300, y: 200 }, { x: 500, y: 200 }
        ]},
      ],
      powerups: [
        { x: 400, y: 150, type: 'INVINCIBILITY' },
        { x: 200, y: 450, type: 'MEGA_GROWTH' },
      ],
      requiredSize: 2.5,
      coins: 3,
      timeLimit: 75
    });

    // Level 3: SKY ASSAULT - Hawks Attack from Above!
    this.levels.push({
      name: 'Level 3: SKY ASSAULT',
      description: 'Deadly hawks dive from above! Use freeze power-up wisely!',
      vegetables: [
        { x: 120, y: 120, type: 'BROCCOLI' },
        { x: 680, y: 120, type: 'BROCCOLI' },
        { x: 120, y: 480, type: 'PEPPER' },
        { x: 680, y: 480, type: 'PEPPER' },
        { x: 400, y: 300, type: 'BROCCOLI' },
      ],
      hazards: [
        { x: 250, y: 200, type: 'BOMB' },
        { x: 550, y: 200, type: 'BOMB' },
        { x: 300, y: 400, type: 'DYNAMITE' },
        { x: 500, y: 400, type: 'DYNAMITE' },
      ],
      obstacles: [
        // Locked chambers protecting valuable veggies
        { x: 80, y: 80, width: 80, height: 80, type: 'LOCKED_CRATE' },
        { x: 640, y: 80, width: 80, height: 80, type: 'LOCKED_CRATE' },
        { x: 80, y: 440, width: 80, height: 80, type: 'LOCKED_CRATE' },
        { x: 640, y: 440, width: 80, height: 80, type: 'LOCKED_CRATE' },
        // Maze walls
        { x: 200, y: 150, width: 20, height: 150, type: 'WALL' },
        { x: 580, y: 150, width: 20, height: 150, type: 'WALL' },
        { x: 200, y: 350, width: 20, height: 150, type: 'WALL' },
        { x: 580, y: 350, width: 20, height: 150, type: 'WALL' },
      ],
      collectibles: [
        { x: 150, y: 200, type: 'KEY' },
        { x: 650, y: 200, type: 'KEY' },
        { x: 150, y: 400, type: 'KEY' },
        { x: 650, y: 400, type: 'KEY' },
        { x: 400, y: 150, type: 'STAR' },
      ],
      enemies: [
        // Hawks swooping in patterns
        { x: 300, y: 150, type: 'HAWK', waypoints: [
          { x: 200, y: 100 }, { x: 300, y: 250 }, { x: 200, y: 400 }
        ]},
        { x: 500, y: 150, type: 'HAWK', waypoints: [
          { x: 600, y: 100 }, { x: 500, y: 250 }, { x: 600, y: 400 }
        ]},
        { x: 400, y: 350, type: 'HAWK', waypoints: [
          { x: 300, y: 300 }, { x: 500, y: 300 }
        ]},
      ],
      powerups: [
        { x: 100, y: 300, type: 'FREEZE_ENEMIES' },
        { x: 700, y: 300, type: 'SHIELD' },
        { x: 400, y: 450, type: 'INVINCIBILITY' },
      ],
      requiredSize: 3.0,
      coins: 5,
      timeLimit: 60
    });

    // Level 4: THE GAUNTLET - All Enemies Combined!
    this.levels.push({
      name: 'Level 4: THE GAUNTLET',
      description: 'Face ALL predators at once! EXTREME CHALLENGE!',
      vegetables: [
        { x: 100, y: 100, type: 'BROCCOLI' },
        { x: 700, y: 100, type: 'BROCCOLI' },
        { x: 100, y: 500, type: 'PEPPER' },
        { x: 700, y: 500, type: 'PEPPER' },
        { x: 400, y: 300, type: 'BROCCOLI' },
        { x: 250, y: 300, type: 'CARROT' },
        { x: 550, y: 300, type: 'CARROT' },
      ],
      hazards: [
        { x: 200, y: 200, type: 'DYNAMITE' },
        { x: 600, y: 200, type: 'DYNAMITE' },
        { x: 300, y: 400, type: 'BOMB' },
        { x: 500, y: 400, type: 'BOMB' },
      ],
      obstacles: [
        // Water hazards
        { x: 180, y: 180, width: 100, height: 80, type: 'WATER' },
        { x: 520, y: 180, width: 100, height: 80, type: 'WATER' },
        { x: 330, y: 350, width: 140, height: 100, type: 'WATER' },
        // Walls creating deadly corridors
        { x: 150, y: 100, width: 20, height: 120, type: 'WALL' },
        { x: 630, y: 100, width: 20, height: 120, type: 'WALL' },
        { x: 250, y: 280, width: 20, height: 140, type: 'WALL' },
        { x: 530, y: 280, width: 20, height: 140, type: 'WALL' },
        // Safe rocks (minimal)
        { x: 350, y: 250, width: 100, height: 15, type: 'ROCK' },
      ],
      collectibles: [
        { x: 400, y: 150, type: 'STAR' },
        { x: 150, y: 300, type: 'COIN' },
        { x: 650, y: 300, type: 'COIN' },
        { x: 400, y: 450, type: 'STAR' },
      ],
      enemies: [
        // CATS patrolling bottom
        { x: 200, y: 450, type: 'CAT', waypoints: [
          { x: 150, y: 450 }, { x: 350, y: 450 }
        ]},
        { x: 600, y: 450, type: 'CAT', waypoints: [
          { x: 450, y: 450 }, { x: 650, y: 450 }
        ]},
        // SNAKES in middle
        { x: 300, y: 300, type: 'SNAKE', waypoints: [
          { x: 200, y: 250 }, { x: 300, y: 350 }
        ]},
        { x: 500, y: 300, type: 'SNAKE', waypoints: [
          { x: 500, y: 250 }, { x: 600, y: 350 }
        ]},
        // HAWKS diving
        { x: 250, y: 150, type: 'HAWK', waypoints: [
          { x: 200, y: 100 }, { x: 300, y: 200 }, { x: 200, y: 300 }
        ]},
        { x: 550, y: 150, type: 'HAWK', waypoints: [
          { x: 600, y: 100 }, { x: 500, y: 200 }, { x: 600, y: 300 }
        ]},
      ],
      powerups: [
        { x: 100, y: 250, type: 'INVINCIBILITY' },
        { x: 700, y: 350, type: 'FREEZE_ENEMIES' },
        { x: 400, y: 500, type: 'MEGA_GROWTH' },
      ],
      requiredSize: 3.5,
      coins: 8,
      timeLimit: 50
    });

    // Level 5: BOSS ARENA - MEGA CAT KING!
    this.levels.push({
      name: 'Level 5: BOSS - MEGA CAT KING',
      description: '⚠️ FINAL BOSS! Defeat the MEGA CAT KING to WIN!',
      vegetables: [
        { x: 100, y: 100, type: 'BROCCOLI' },
        { x: 700, y: 100, type: 'BROCCOLI' },
        { x: 100, y: 500, type: 'BROCCOLI' },
        { x: 700, y: 500, type: 'BROCCOLI' },
        { x: 400, y: 150, type: 'PEPPER' },
        { x: 250, y: 300, type: 'PEPPER' },
        { x: 550, y: 300, type: 'PEPPER' },
        { x: 400, y: 450, type: 'BROCCOLI' },
      ],
      hazards: [
        { x: 200, y: 200, type: 'DYNAMITE' },
        { x: 600, y: 200, type: 'DYNAMITE' },
        { x: 200, y: 400, type: 'DYNAMITE' },
        { x: 600, y: 400, type: 'DYNAMITE' },
        { x: 300, y: 300, type: 'BOMB' },
        { x: 500, y: 300, type: 'BOMB' },
      ],
      obstacles: [
        // Arena walls - circular battle arena
        { x: 0, y: 80, width: 200, height: 20, type: 'WALL' },
        { x: 600, y: 80, width: 200, height: 20, type: 'WALL' },
        { x: 0, y: 520, width: 200, height: 20, type: 'WALL' },
        { x: 600, y: 520, width: 200, height: 20, type: 'WALL' },
        { x: 50, y: 100, width: 20, height: 120, type: 'WALL' },
        { x: 730, y: 100, width: 20, height: 120, type: 'WALL' },
        { x: 50, y: 380, width: 20, height: 120, type: 'WALL' },
        { x: 730, y: 380, width: 20, height: 120, type: 'WALL' },
        // Water hazards in corners
        { x: 80, y: 80, width: 80, height: 80, type: 'WATER' },
        { x: 640, y: 80, width: 80, height: 80, type: 'WATER' },
        { x: 80, y: 440, width: 80, height: 80, type: 'WATER' },
        { x: 640, y: 440, width: 80, height: 80, type: 'WATER' },
      ],
      collectibles: [
        { x: 150, y: 150, type: 'STAR' },
        { x: 650, y: 150, type: 'STAR' },
        { x: 150, y: 450, type: 'STAR' },
        { x: 650, y: 450, type: 'STAR' },
        { x: 400, y: 300, type: 'STAR' },
      ],
      enemies: [
        // BOSS - Giant Cat in center with wide patrol
        { x: 400, y: 300, type: 'CAT', waypoints: [
          { x: 300, y: 200 }, { x: 500, y: 200 },
          { x: 500, y: 300 }, { x: 500, y: 400 },
          { x: 300, y: 400 }, { x: 300, y: 300 }
        ]},
        // Minion snakes
        { x: 250, y: 200, type: 'SNAKE', waypoints: [
          { x: 200, y: 150 }, { x: 300, y: 250 }
        ]},
        { x: 550, y: 200, type: 'SNAKE', waypoints: [
          { x: 600, y: 150 }, { x: 500, y: 250 }
        ]},
        { x: 250, y: 400, type: 'SNAKE', waypoints: [
          { x: 200, y: 450 }, { x: 300, y: 350 }
        ]},
        { x: 550, y: 400, type: 'SNAKE', waypoints: [
          { x: 600, y: 450 }, { x: 500, y: 350 }
        ]},
        // Hawk reinforcements
        { x: 300, y: 150, type: 'HAWK', waypoints: [
          { x: 200, y: 100 }, { x: 400, y: 200 }, { x: 200, y: 300 }
        ]},
        { x: 500, y: 150, type: 'HAWK', waypoints: [
          { x: 600, y: 100 }, { x: 400, y: 200 }, { x: 600, y: 300 }
        ]},
      ],
      powerups: [
        { x: 100, y: 300, type: 'INVINCIBILITY' },
        { x: 700, y: 300, type: 'INVINCIBILITY' },
        { x: 400, y: 100, type: 'FREEZE_ENEMIES' },
        { x: 400, y: 500, type: 'MEGA_GROWTH' },
        { x: 200, y: 300, type: 'SHIELD' },
        { x: 600, y: 300, type: 'SPEED' },
      ],
      requiredSize: 4.0,
      coins: 15,
      timeLimit: 120,
      boss: true
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
