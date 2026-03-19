//package com.example.GameMenu;


import javax.swing.*;
import java.awt.*;
import java.awt.event.*;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.concurrent.TimeUnit;

public class WordleUIBool {
    public static String playerAns;
    public static int guesses = 6; // Wordle usually allows 6 guesses
    public static String randword;
    public static char[] feedbackArray = new char[5]; // For feedback on each letter
    public static boolean didWin = false;
    public static volatile boolean done = false;
    public static volatile boolean didExit = false;

    public boolean playGame(int playerCount, String[] players, String currentPlayerName, String otherPlayerName, int level) {
        guesses = 8 - level;
        WordleBool w = new WordleBool();
        return initializeUI();
    }

    // Get a random word from the word list
    public static void getWord() throws IOException {
        int randint = (int) (Math.random() * 2309);
        String currentWorkingDir = System.getProperty("user.dir");
        String filePath = currentWorkingDir + "/src/Files/wordle.txt";
        randword = Files.readAllLines(Path.of(filePath)).get(randint).toLowerCase();
//        System.out.println("Answer (for testing): " + randword); // Remove or comment out for production
        System.out.println("We're gonna play wordle in a new window! ");
    }

    // Check answer and update feedbackArray with results
    public static boolean checkAns(String ans) {
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
    public static boolean initializeUI() {
        try {
            getWord(); // Generate a random word
        } catch (IOException e) {
            throw new RuntimeException(e);
        }



            Frame frame = new Frame("Wordle");
            frame.setLayout(new BorderLayout());

            // Main panel with components for user interaction
            Panel mainPanel = new Panel(new GridLayout(5, 1));

            // Title label
            Label title = new Label("Wordle", Label.CENTER);
            title.setFont(new Font("Arial", Font.BOLD, 20));
            mainPanel.add(title);

            // Right or wrong feedback label
            Label feedbackLabel = new Label("Enter a 5-letter word", Label.CENTER);
            feedbackLabel.setFont(new Font("Arial", Font.BOLD, 16));
            mainPanel.add(feedbackLabel);

            // Panel for user input
            Panel inputPanel = new Panel(new FlowLayout());
            Label playerAnsLabel = new Label("Your Guess:");
            TextField playerAnsText = new TextField(15);
            inputPanel.add(playerAnsLabel);
            inputPanel.add(playerAnsText);
            mainPanel.add(inputPanel);

            // Guesses left label
            Label guessesLeftLabel = new Label("Guesses Left: " + guesses, Label.CENTER);
            guessesLeftLabel.setFont(new Font("Arial", Font.BOLD, 16));
            mainPanel.add(guessesLeftLabel);


            // Guesses done label
            List<String> wordsSpelled = new ArrayList<>();
            Label guessesDoneLabel = new Label("Your guesses will show here.", Label.CENTER);
            guessesDoneLabel.setFont(new Font("Arial", Font.BOLD, 16));
            mainPanel.add(guessesDoneLabel);

            // Add main panel to the frame
            frame.add(mainPanel, BorderLayout.CENTER);


            // Help button in the top-right corner
            Panel helpPanel = new Panel(new FlowLayout(FlowLayout.RIGHT));
            Button helpButton = new Button("Help");
            helpButton.setPreferredSize(new Dimension(60, 25)); // Set smaller size for the button
            helpPanel.add(helpButton);
            frame.add(helpPanel, BorderLayout.NORTH); // Place help panel at the top


            //Help button Action command
            helpButton.addActionListener(new ActionListener() {
                public void actionPerformed(ActionEvent e) {
                    JOptionPane.showMessageDialog(frame, """
                            You Must Enter a 5 Letter word
                            \
                            You have""" + " "+guesses+" "+
                            """ 
                            total guesses
                            \
                            X means the leter is not in the word
                            \
                            ? means the letter is in the word but not in the right spot
                            \
                            ✓ means that the letter is in the right spot 
                            \
                            when you get 5 ✓'s you win
                            """);
                }
            });

            // Set up key listener for the Enter key
            playerAnsText.addKeyListener(new KeyAdapter() {
                public void keyPressed(KeyEvent e) {
                    if (e.getKeyCode() == KeyEvent.VK_ENTER) {
                        playerAns = playerAnsText.getText().toLowerCase();

                        if(playerAns.equals("cheater")){
                            feedbackLabel.setText("You cheater. Here's the dumb word.");
                            playerAnsText.setText(randword);
                            return;
                        }

                        if (playerAns.length() != 5) {
                            feedbackLabel.setText("Please enter a 5-letter word.");
                            playerAnsText.setText("");
                            return;
                        }



                        boolean correct = checkAns(playerAns);
                        if (correct) {
                            feedbackLabel.setText("Correct! You guessed the word! ");
                            title.setText("You can close this window.");
//                            try {
//                                TimeUnit.SECONDS.sleep(2);
//                            } catch (InterruptedException ex) {
//                                throw new RuntimeException(ex);
//                            }
                            didWin = true;
                            done = true;
//                            System.out.println("Correct! You guessed the word! You can keep your square!");

//                        frame.dispose(); // Close the game window after winning


                        } else {
                            guesses--;
                            guessesLeftLabel.setText("Guesses Left: " + guesses);
                            wordsSpelled.add(playerAns.toUpperCase() + ": " + new String(feedbackArray));
                            guessesDoneLabel.setText("Guesses Done: " + wordsSpelled);
                            feedbackLabel.setText("Feedback: " + new String(feedbackArray));
                            playerAnsText.setText("");

                            if (guesses == 0) {
                                feedbackLabel.setText("Game Over! The word was: " + randword + ".");
                                title.setText("You can close this window.");
                                playerAnsText.setEnabled(false); // Disable input on game over
                                done = true;
                                didWin = false;
//                                System.out.println("You didn't guessed the word. You lose your square.");
                            }
                        }
                    }
                }
            });


            // Window close event

            frame.addWindowListener(new WindowAdapter() {
                @Override
                public void windowClosing(WindowEvent e) {
                    if (!didWin && !done) {
                        System.out.println("Your window closed and you didn't even finish the game! You lose your square.");
                    } else if (!didWin && done) {
                        System.out.println("Your window closed and you didn't win the game! That's okay, but you still lose your square.");
                    } else {
                        System.out.println("You win! Nice! You can keep your square!");
                    }
                    done = true;
                    didExit = true;
                    frame.dispose();
                }
            });

            frame.setSize(500, 300); // Adjust size as needed
            frame.setVisible(true);
            frame.setLocationRelativeTo(null); // Center the window


        while (!didExit) {
            Thread.onSpinWait();
        }
        return didWin;

    }
}