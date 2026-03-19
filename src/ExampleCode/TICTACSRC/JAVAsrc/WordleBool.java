//package com.example.GameMenu;


import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Scanner;

public class WordleBool {
    public static String playerAns;
    public static int guesses = 7; // Wordle usually allows 6 guesses
    public static String randword;
    public static char[] feedbackArray = new char[5]; // For feedback on each letter

    public boolean playGame(int playerCount, String[] players, String currentPlayerName, String otherPlayerName, int level) {
        guesses = 8-level;
        Scanner scanner = new Scanner(System.in);
        WordleBool w = new WordleBool();
        return initializeUI(scanner);
    }

    // Get a random word from the word list
    public static void getWord() throws IOException {
        int randint = (int) (Math.random() * 2309);
        String currentWorkingDir = System.getProperty("user.dir");
        String filePath = currentWorkingDir + "/src/Files/wordle.txt";
        randword = Files.readAllLines(Path.of(filePath)).get(randint).toLowerCase();
//        System.out.println("Answer (for testing): " + randword); // Remove or comment out for production
    }

    // Check answer and update feedbackArray with results
    public static boolean checkAns(String ans) {
        ans = ans.toLowerCase();
        Arrays.fill(feedbackArray, '-'); // Reset feedback for each guess
        boolean isCorrect = ans.equals(randword);

        for (int i = 0; i < 5; i++) {
            if (randword.charAt(i) == ans.charAt(i)) {
                feedbackArray[i] = '✓'; // Correct letter in correct position
            } else if (randword.contains(String.valueOf(ans.charAt(i)))) {
                feedbackArray[i] = '?'; // Correct letter in wrong position
            } else {
                feedbackArray[i] = 'X'; // Incorrect letter
            }
        }
        return isCorrect;
    }

    // Initialize and set up the UI
    public static boolean initializeUI(Scanner scanner) {


        try {
            getWord(); // Generate a random word
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
        System.out.println("\nWelcome to Wordle!");

        List<String> wordsSpelled = new ArrayList<>();


        System.out.print("\nWould you like the rules? ");
        while (true) {
            String displayYesNo = " ";
            System.out.print("y/n: ");
            try {
                displayYesNo = scanner.nextLine();
            } catch (Exception e) {
            }
            if (displayYesNo.equals("y") || displayYesNo.equals("Y")) {

                System.out.println("""
                        You Must Enter a 5 Letter word
                        \
                        You have """+ " "+guesses+ " "+
                        """
                        total guesses
                        \
                        X means the letter is not in the word
                        \
                        ? means the letter is in the word but not in the right spot
                        \
                        ✓ means that the letter is in the right spot 
                        \
                        when you get 5 ✓'s you win
                        """);

                System.out.println("Moving on...");
                break;
            } else {
                break;
            }
        }


        while (true) {
            System.out.print("\nPlease enter a 5-letter word: ");
            playerAns = scanner.nextLine();

            if (playerAns.length() != 5) {
                System.out.println("That's not a 5-letter word!");
                continue;
            }

            boolean correct = checkAns(playerAns);
            if (correct) {
                System.out.println("Correct! You guessed the word!");
                return true;
            } else {
                guesses--;
                System.out.println("Guesses Left: " + guesses);
                wordsSpelled.add(playerAns.toUpperCase() + ": " + new String(feedbackArray));
                System.out.println("Guesses Done: " + wordsSpelled);
                System.out.println("That wasn't quite right!");

                if (guesses == 0) {
                    System.out.println("Game Over! The word was: " + randword);
                    return false;
                }

            }
        }


    }
}