import { CodeBlock } from "@/components/CodeBlock";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Code } from "lucide-react";

const javaCode = `import java.util.Random; // Used to generate a random number
import java.util.Scanner; // Used to read user input

public class GuessingGame {
    public static void main(String[] args) {
        // 1. Initialize necessary objects
        Scanner scanner = new Scanner(System.in); // For reading user input
        Random random = new Random();             // For generating the random number

        // 2. Generate the random number (between 1 and 100)
        int numberToGuess = random.nextInt(100) + 1;
        int numberOfTries = 0;
        int guess;
        boolean hasGuessedCorrectly = false;

        System.out.println("--- Welcome to the Number Guessing Game! ---");
        System.out.println("I have selected a number between 1 and 100.");
        System.out.println("Try to guess it!");

        // 3. Game loop
        while (!hasGuessedCorrectly) {
            System.out.print("Enter your guess: ");
            
            // Validate that the input is an integer
            if (scanner.hasNextInt()) {
                guess = scanner.nextInt();
                numberOfTries++;

                // 4. Check the guess and provide hints
                if (guess < numberToGuess) {
                    System.out.println("Too low! Try again.");
                } else if (guess > numberToGuess) {
                    System.out.println("Too high! Try again.");
                } else {
                    hasGuessedCorrectly = true;
                    System.out.println("Congratulations! You've guessed the number!");
                    System.out.println("It took you " + numberOfTries + " tries.");
                }
            } else {
                System.out.println("That's not a valid number. Please enter an integer.");
                scanner.next(); // Clear the invalid input
            }
        }

        // 5. Clean up resources
        scanner.close();
    }
}`;

export default function GuessingGamePage() {
    return (
        <div className="container mx-auto p-4 md:p-8">
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-md">
                            <Code className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                            <CardTitle>Java Number Guessing Game</CardTitle>
                            <CardDescription>
                                A classic programming exercise in Java, properly formatted.
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <CodeBlock language="java" code={javaCode} />
                </CardContent>
            </Card>
        </div>
    );
}
