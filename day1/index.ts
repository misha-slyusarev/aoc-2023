import * as fs from 'fs';
import * as readline from 'readline';
import * as path from 'path';

function isDigit(char: string): boolean {
    return char >= '0' && char <= '9';
}

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

async function processFile(): Promise<number> {
    const processLine = createLineProcessor('input.txt');

    let resultSum: number = 0;

    await processLine(async (line) => {
        let firstDigit: number | null = null;
        let secondDigit: number | null = null;

        for (const ch of line) {
            if ( isDigit(ch) ) {
                if (firstDigit === null) {
                    firstDigit = Number(ch)
                } else {
                    secondDigit = Number(ch)
                }
            }
        }

        if(secondDigit === null) {
            secondDigit = firstDigit
        }

        resultSum += secondDigit! + firstDigit! * 10
    });

    return resultSum
}

async function processFileSecondTime(): Promise<number>{
    const processLine = createLineProcessor('input.txt');
    const keywords = ["one", "two", "three", "four", "five", "six", "seven", "eight", "nine"];
    let resultSum: number = 0;

    await processLine(async(line) => {
        let firstDigit: number | null = null;
        let secondDigit: number | null = null;

        for (const [ind, ch] of Array.from(line).entries()) {
            if (isNaN(parseInt(ch))) {
                for (const [keynum, keyword] of keywords.entries()) {
                    if (line.startsWith(keyword, ind)) {
                        if (firstDigit === null) {
                            firstDigit = keynum + 1
                        } else {
                            secondDigit = keynum + 1
                        }
                    }
                }
            } else {
                if (firstDigit === null) {
                    firstDigit = parseInt(ch)
                } else {
                    secondDigit = parseInt(ch)
                }
            }
        }

        if(secondDigit === null) secondDigit = firstDigit;
        resultSum += secondDigit! + firstDigit! * 10
    })

    return resultSum
}

processFile().then(result => {
    console.log("First: " + result);
}).catch(error => {
    console.error('An error occurred:', error);
});

processFileSecondTime().then(result => {
    console.log("Second: " + result)
}).catch(error => {
    console.error('An error occurred:', error);
});
