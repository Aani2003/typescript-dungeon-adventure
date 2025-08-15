import inquirer from "inquirer";

let enemies: string[] = ['🐉 Dragon', '⚔️ Knight', '🧙 Wizard', '🏹 Archer'];
let maxEnemyHealth: number = 60;
let enemyAttackDamage: number = 30;

let health: number = 100;  // Player health
let attackDamage: number = 60;
let numHealthPotions: number = 3;
let healthPotionHealAmount: number = 25;
let healthPotionDropChance: number = 50; // Percentage

let playerLevel: number = 1;
let xp: number = 0;
let xpToLevelUp: number = 100; // XP needed for next level
let criticalHitChance: number = 15; // Percentage chance for a crit

let running: boolean = true;

let getRandomNumber = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

let gainXP = (amount: number) => {
    xp += amount;
    console.log(`\t✨ You gained ${amount} XP! (${xp}/${xpToLevelUp})`);

    if (xp >= xpToLevelUp) {
        playerLevel++;
        xp -= xpToLevelUp;
        xpToLevelUp = Math.floor(xpToLevelUp * 1.2); // Increase XP requirement
        health += 20; // Bonus health on level-up
        attackDamage += 5; // Stronger attacks
        console.log(`\n\t🏅 LEVEL UP! You are now level ${playerLevel}!`);
        console.log(`\t💖 Max health increased, attack damage increased!`);
    }
};

console.log("\n\t🗡️  Welcome to the Dungeon!");

GAME:
while (running) {
    console.log("\t-------------------------------------------");
    let enemyHealth: number = getRandomNumber(1, maxEnemyHealth);
    let enemy: string = enemies[getRandomNumber(0, enemies.length - 1)]!;

    console.log(`\t⚠️  ${enemy} has appeared ⚠️\n`);

    while (enemyHealth > 0) {
        console.log(`\t❤️  Your HP: ${health}`);
        console.log(`\t👾  ${enemy} HP: ${enemyHealth}`);

        let control = await inquirer.prompt({
            message: "\n\tWhat would you like to do?",
            type: "list",
            choices: ["\t⚔️ Attack", "\t🧪 Drink Health Potion", "\t🏃 Run"],
            name: "command"
        });

        switch (control.command) {
            case "\t⚔️ Attack":
                let isCritical = getRandomNumber(1, 100) <= criticalHitChance;
                let strikeDamage: number = getRandomNumber(1, attackDamage);
                if (isCritical) {
                    strikeDamage *= 2;
                    console.log(`\t💥 CRITICAL HIT! Damage doubled!`);
                }

                let damageTaken: number = getRandomNumber(1, enemyAttackDamage);

                health -= damageTaken;
                enemyHealth -= strikeDamage;

                console.log(`\n\t⚔️ You struck the ${enemy} with ${strikeDamage} damage.`);
                console.log(`\n\t💢 You received ${damageTaken} damage from the enemy.`);

                if (health < 1) {
                    console.log(`\n\t💀 You have taken too much damage. You are too weak to go on.`);
                    break;
                }
                break;

            case "\t🧪 Drink Health Potion":
                if (numHealthPotions > 0) {
                    health += healthPotionHealAmount;
                    numHealthPotions--;
                    console.log(`\t🧪 You drank a health potion, healing for ${healthPotionHealAmount}.`);
                    console.log(`\t💖 HP: ${health} | 🧪 Potions left: ${numHealthPotions}`);
                } else {
                    console.log(`\t❌ You have no health potions left. Defeat enemies to get more.`);
                }
                break;

            case "\t🏃 Run":
                console.log(`\t🏃 You run away from the ${enemy}`);
                continue GAME; 
        }
    }

    if (health < 1) {
        console.log(`\n\tYou limp out of the dungeon, weak from battle.\n`);
        break;
    }

    console.log("\t-------------------------------------------");
    console.log(`\t✅ ${enemy} has been defeated!`);
    console.log(`\t❤️ You have ${health} HP left.`);

    
    let xpEarned = getRandomNumber(20, 40); // XP gain after defeating enemy
    gainXP(xpEarned);

    if (getRandomNumber(1, 100) < healthPotionDropChance) {
        numHealthPotions++;
        console.log(`\t# The ${enemy} dropped a health potion! #`);
        console.log(`\t# You now have ${numHealthPotions} health potion(s). #\n`);
    }

    let stateControl = await inquirer.prompt({
        message: "\tWhat would you like to do?",
        type: "list",
        choices: ["\tContinue fighting", "\tExit Dungeon"],
        name: "command"
    });

    if (stateControl.command == "\tContinue fighting") {
        console.log(`\n\t🔥 You continue your adventure!`);
    } else {
        console.log(`\n\t🚪 You exited the dungeon, successful from your adventures.`);
        break;
    }
}

console.log(`\n\t🏆    Thank you for playing   🏆`);
