interface generateRandomNumberParameters {
    min?: number,
    max?: number,
    length?: number
}

/**
 * Ex:
 * const random5DigitNumber = generateRandomNumber({ length: 5 });  // Output: e.g., "42703"
 * const randomNumberInRange = generateRandomNumber({ min: 1000, max: 9999, length: 4 }); // Output: e.g., "5678"
 */
export function generateRandomNumber({ min = 0, max, length }: generateRandomNumberParameters) {
    // Check if length is required and positive
    if (typeof length !== "number" || length <= 0) {
        throw new Error("Invalid parameter: length must be a positive number.");
    }

    // Calculate max based on length if not provided
    if (!max) {
        max = 9 ** length - 1;
    }

    // Ensure min is less than max
    if (min >= max) {
        throw new Error("Invalid parameters: min must be less than max.");
    }

    // Calculate the range
    const range = max - min + 1;

    // Generate a random number within the range
    const randomNumber = Math.floor(Math.random() * range) + min;

    // Convert the number to a string and pad with zeros if necessary
    let numberString = randomNumber.toString();
    while (numberString.length < length) {
        numberString = "0" + numberString;
    }

    return numberString;
}