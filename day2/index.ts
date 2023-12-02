import path from "path";
import fs from "fs";
import readline from "readline";

function createLineProcessor(fileName: string) {
    const inputFilePath = path.join(__dirname, fileName);

    return async (lineHandler: (line: string) => Promise<void>) => {
        const fileStream = fs.createReadStream(inputFilePath);

        const rli = readline.createInterface({
            input: fileStream,
            crlfDelay: Infinity
        });

        for await (const line of rli) {
            await lineHandler(line);
        }
    };
}

async function solvePartOne(): Promise<number> {
    const processLine = createLineProcessor('input.all.txt');
    const constraints: { [key: string]: number } = { red: 12, green: 13, blue: 14 };

    let resultSum: number = 0;

    await processLine(async (line) => {
        const [game, sets] = line.split(":")
        let constraintsExceeded = false

        for (const set of sets.split(";")) {
            for (const cubes of set.split(",")) {
                const [number, color] = cubes.slice(1).split(" ")
                if (constraints[color] < parseInt(number)) {
                    console.log("Color " + color + " exceeds constraints with " + number + " cubes")
                    constraintsExceeded = true
                }
            }
        }

        if (!constraintsExceeded) {
            console.log(game)
            resultSum += parseInt(game.split(" ")[1])
        }
    })

    return resultSum;
}

async function solvePartTwo(): Promise<number> {
    const processLine = createLineProcessor('input.all.txt');

    let resultSum: number = 0;

    await processLine(async (line) => {
        const [game, sets] = line.split(":")
        let maxCubes: { [key: string]: number } = { red: 0, green: 0, blue: 0 };

        for (const set of sets.split(";")) {
            for (const cubes of set.split(",")) {
                const [numberStr, color] = cubes.slice(1).split(" ")
                const num = parseInt(numberStr);
                if (maxCubes[color] < num) maxCubes[color] = num;
            }
        }

        resultSum += maxCubes.red * maxCubes.blue * maxCubes.green
    })

    return resultSum;
}

solvePartOne().then(result => {
    console.log("First: " + result);
}).catch(error => {
    console.error('An error occurred:', error);
});

solvePartTwo().then(result => {
    console.log("Second: " + result);
}).catch(error => {
    console.error('An error occurred:', error);
});