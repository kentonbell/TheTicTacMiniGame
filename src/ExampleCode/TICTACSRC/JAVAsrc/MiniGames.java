import java.io.IOException;
import java.nio.file.NoSuchFileException;
import java.nio.file.Paths;
import java.nio.file.Files;
import java.util.*;
//import java.nio.file.Files;

public class MiniGames {

    //methods will be included as playable games which start with final and are boolean

    // levels 1. easy 2. medium 3. hard. 4. Implausible


    /**
     * This game has every continent to that you can play and also capitals, so it is many games in one.
     *
     * One option is randomly selected and you name countries or capitals there.
     *
     * @param playerCount # of players
     * @param players array of names
     * @param currentPlayerName the current player who will play this game
     * @param otherPlayerName the opponent, involved in some games
     * @param level levels 1-4
     * @return did the player win
     */
    public static boolean finalCountries(int playerCount, String[] players, String currentPlayerName, String otherPlayerName, int level) {



        Scanner scanner = new Scanner(System.in);
        Random random = new Random();


        if (currentPlayerName.equals("CPU")) { // make sure this index exist or error.
            String gameName = "Countries"; // The "blank" Game
            return cpuGame(gameName, level);
        }

        String[] cheers = {"Nice!", "Good job!", "Almost There!", "Well done.", "Keep it up!","You're doing great.","Good job "+currentPlayerName,"Nice job "+currentPlayerName+"!", "Well done "+currentPlayerName+"!","Awesome!" };
        int randomCheerInt = random.nextInt(cheers.length);
        String randomCheer = cheers[randomCheerInt];

        System.out.println("Welcome to The Countries Game!\n");

        String[] continents = {"capitals", "oceania", "asia", "south america", "north america", "europe", "africa", "all countries", "all countries"};

        int randomContinentIndex = random.nextInt(continents.length);
        String gameChoice = continents[randomContinentIndex];
        String gameChoiceTitleCase = toTitleCase(gameChoice);
        System.out.println("This game's topic is naming " + gameChoiceTitleCase + "!");


        String currentWorkingDir = System.getProperty("user.dir");
        String filePath = currentWorkingDir + "/src/Files/Continents/" + gameChoice + ".txt";
        try {
            // Read all lines from the file into a List
            List<String> lines = Files.readAllLines(Paths.get(filePath));
            if (!lines.isEmpty()) {
                int randomIndex = random.nextInt(lines.size());


                int tries = 3 + level * 2;

                tries = (gameChoice.equals("all countries")) ? tries + 3 * level : tries;

                if (gameChoice.equals("capitals")) {
                    System.out.println("Keeping naming the world's capitals until you get to " + tries + " capitals.");
                } else if (gameChoice.equals("all countries")) {
                    System.out.println("Keeping naming countries until you get to " + tries + " countries.");
                } else {
                    System.out.println("Keeping finding countries in " + gameChoiceTitleCase + " until you name " + tries + " countries.");
                }

                int amountOfCountries = 1;
                List<String> wordsSpelled = new ArrayList<>();

                int twoOutOfThreeTries = 1;


                while (amountOfCountries <= tries) {


                    if (gameChoice.equals("capitals")) {
                        System.out.print("Name a capital(" + amountOfCountries + " out of " + tries + "): ");
                    } else {
                        System.out.print("Name a country(" + amountOfCountries + " out of " + tries + "): ");
                    }
                    String wordSpelled = scanner.nextLine();

                    if (wordSpelled.equals("WRONG")){
                        System.out.println("\nYOU JUST MIGHT BE A CHEATER HERE. (but you still have to find all those countries so you're not getting ahead)\n\nbut if not\n\nI apologize. The database isn't perfect. You get your strike back.\n");
                        if (gameChoice.equals("capitals")) {
                            System.out.print("Now let's name your next capital(" + amountOfCountries + " out of " + tries + "): ");
                        } else {
                            System.out.print("Name a country(" + amountOfCountries + " out of " + tries + "): ");
                        }
                        twoOutOfThreeTries--;
                        wordSpelled = scanner.nextLine();
                    }


                    boolean foundWord = false;


                    for (int i = 0; i < lines.size(); i++) {

                        String checkerWord = lines.get(i);

                        checkerWord = checkerWord.toLowerCase();
                        wordSpelled = wordSpelled.toLowerCase();


                        if (checkerWord.equals(wordSpelled)) {

                            if (!wordsSpelled.contains(wordSpelled)) {
                                randomCheerInt = random.nextInt(cheers.length);
                                randomCheer = cheers[randomCheerInt];
                                System.out.println(randomCheer);
                                foundWord = true;
                                amountOfCountries++;
                                wordsSpelled.add(wordSpelled);
                                break;
                            } else {
                                System.out.println("You already said that one. Not sure if you were trying to cheat or it's just bad memory. Either way, you now have to find one more for that.");
                                amountOfCountries--;
                                foundWord = true;
                                break;
                            }
                        }

                    }
                    if (foundWord) {
                        continue;
                    } else if (twoOutOfThreeTries <= 2) {
                        System.out.println("That's not in the database. That's strike " + twoOutOfThreeTries + ".");
                        twoOutOfThreeTries++;
                    } else {
                        System.out.println("That wasn't right! That's strike 3. You loose your square.");

                        System.out.println("\nWould you like to display the list of all options before we move on? ");
                        while (true) {
                            String displayYesNo = " ";
                            System.out.print("y/n: ");
                            try {
                                displayYesNo = scanner.nextLine();
                            } catch (Exception e) {
                            }
                            if (displayYesNo.equals("y") || displayYesNo.equals("Y") || displayYesNo.equals("yes") || displayYesNo.equals("Yes")) {
                                System.out.println();
                                System.out.print(lines);
                                System.out.println("\nMoving on...");
                                break;
                            } else {
                                break;
                            }
                        }
                        return false;
                    }


                } // end while done

                System.out.println("You did it! Well done! You keep your square");
                return true;

            } else {
                System.out.println("The file is empty.");
            }
        } catch (Exception e) {
            System.out.println("General error occurred.");
            throw new RuntimeException(e);
        }


        return false;
    }




    /**
     * Simple Unscrambler
     *
     * @param playerCount # of players
     * @param players array of names
     * @param currentPlayerName the current player who will play this game
     * @param otherPlayerName the opponent, involved in some games
     * @param level levels 1-4
     * @return did the player win
     */
    public static boolean finalUnscrambleWord(int playerCount, String[] players, String currentPlayerName, String otherPlayerName, int level) {
        Scanner scanner = new Scanner(System.in);
        Random random = new Random();

        if (currentPlayerName.equals("CPU")) { // make sure this index exist or error.
            String gameName = "Unscrambler"; // The "blank" Game
            return cpuGame(gameName, level);
        }

        String filePath1000;
        String filePath1000scrambled;
        int tries;
        int shuffles;


        int oneOrThree = random.nextInt(2);
        if (oneOrThree == 0) {

            System.out.println("Welcome to Unscrambler " + currentPlayerName + "! \n\nWe're going to choose from the top 1000 words in the English language.");

            String currentWorkingDir = System.getProperty("user.dir");
            filePath1000 = currentWorkingDir + "/src/Files/1000topwords.txt";
            filePath1000scrambled = currentWorkingDir + "/src/Files/1000topscrambledwords.txt";

            tries = 4 + (level - 1) * 3;
            shuffles = 4 - level;
        } else {
            System.out.println("Welcome to Unscrambler! \n\nWe're going to choose from the top 3000 words in the English language.");

            String currentWorkingDir = System.getProperty("user.dir");
            filePath1000 = currentWorkingDir + "/src/Files/3000topwords.txt";
            filePath1000scrambled = currentWorkingDir + "/src/Files/3000topscrambledwords.txt";

            tries = 2 + (level - 1) * 3;
            shuffles = 8 - level;
        }

        try {
            // Read all lines from the file into a List
            List<String> lines = Files.readAllLines(Paths.get(filePath1000));
            List<String> scrambledLines = Files.readAllLines(Paths.get(filePath1000scrambled));

            if (!lines.isEmpty() && !scrambledLines.isEmpty()) {


                boolean done = false;
                int currentTry = 1;
                System.out.println("\nLet's unscramble " + tries + " words. You have three strikes per word. \nYou also have " + shuffles + " free shuffles. Press enter (with no text) to use them.\n");

                while (!done && currentTry <= tries) {

                    int randomIndex = random.nextInt(lines.size());
                    String randomWord = lines.get(randomIndex);
                    String randomScrambledWord = scrambledLines.get(randomIndex);


                    int twoOutOfThreeTries = 1;

                    while (twoOutOfThreeTries <= 3) {

                        System.out.print("Word " + currentTry + "/" + tries + ": Unscrambled the word: \"" + randomScrambledWord + "\" correctly: ");

                        String wordSpelled = scanner.nextLine();

                        if (wordSpelled.isEmpty()) {
                            if (shuffles != 0) {
                                shuffles--;
                                System.out.println("You used a shuffle. The word was " + randomWord);
                                break;
                            } else {
                                System.out.println("No more shuffles. Nice try.");
                                continue;
                            }
                        }


                        randomWord = randomWord.toLowerCase();
                        wordSpelled = wordSpelled.toLowerCase();

                        if (randomWord.equals(wordSpelled)) {
                            System.out.println("Good job! That was right!\n");
                            currentTry++;
                            break;

                        } else if (twoOutOfThreeTries <= 2) {
                            System.out.println("That wasn't right. That's strike " + twoOutOfThreeTries + "!");
                            twoOutOfThreeTries++;
                        } else {
                            System.out.println("That wasn't right either. That's strike three! So you loose your square. The word was: " + randomWord);
                            done = true;
                            return false;
                        }


                    } // end 2/3

                } // end while done

                System.out.println("You're a great unscrambler. You can keep your square. ");
                return true;

            } else {
                System.out.println("The file is empty.");
            }
        } catch (Exception e) {
            System.out.println("General error occurred.");
            throw new RuntimeException(e);
        }


        return false;
    }




    /**
     * Simple Anagrams
     *
     * @param playerCount # of players
     * @param players array of names
     * @param currentPlayerName the current player who will play this game
     * @param otherPlayerName the opponent, involved in THIS game
     * @param level levels 1-4
     * @return did the player win
     */
    public static boolean finalAnagrams(int playerCount, String[] players, String currentPlayerName, String otherPlayerName, int level) {
        Scanner scanner = new Scanner(System.in);
        Random random = new Random();


        if (currentPlayerName.equals("CPU")) { // make sure this index exist or error.
            String gameName = "Anagrams"; // The "blank" Game
            return cpuGame(gameName, level);
        } else if (players[1].equals("CPU")) {
            return finalCountries(playerCount, players, currentPlayerName, otherPlayerName, level);
        }

        int[] playerWordAmountArray = new int[playerCount];

        for (int i = 0; i < playerCount; i++) {
            playerWordAmountArray[i] = 0;
        }

        String playingPlayer = currentPlayerName;

        System.out.println("Welcome to Anagrams! \n  The goal is to spell more words than everyone else from letters within the word provided. " +
                "(You can duplicate letters, so proper can come out of rope. Pretty cool!)");

        String currentWorkingDir = System.getProperty("user.dir");
        String filePath = currentWorkingDir + "/src/Files/words.txt";
        String filepath3000 = currentWorkingDir + "/src/Files/3000topwords.txt";
        try {
            // Read all lines from the file into a List
            List<String> lines = Files.readAllLines(Paths.get(filePath));
            List<String> lines3000 = Files.readAllLines(Paths.get(filepath3000));
            if (!lines.isEmpty() || !lines3000.isEmpty()) {

                for (int i = 0; i < playerCount; i++) {

                    String randomWord;

                    if (i == 0) {
                        System.out.println("\nYou go first, " + currentPlayerName + ". If you spell more letters than " + otherPlayerName + " you win. ");
                    } else {
                        playingPlayer = otherPlayerName;
                        System.out.println("\n\nNext person! Try to spell more letters. ");
                    }

                    while (true) {
                        int randomIndex3000 = random.nextInt(lines3000.size());
                        randomWord = lines3000.get(randomIndex3000);
                        if (randomWord.length() > 7) {
                            break;
                        }
                    }

                    List<String> wordsSpelled = new ArrayList<>();


                    while (true) {

                        System.out.print("\nYour count, " + playingPlayer + ": " + playerWordAmountArray[i] + ". Spell a words from the letters of \"" + randomWord + "\" until you can't anymore. \nJust press enter to finish your turn: ");
                        String wordSpelled = scanner.nextLine();

                        boolean validWord = false;
                        for (int ii = 0; ii < lines.size(); ii++) {

                            String checkerWord = lines.get(ii);

                            checkerWord = checkerWord.toLowerCase();
                            wordSpelled = wordSpelled.toLowerCase();

                            if (checkerWord.equals(wordSpelled)) {
                                if (!wordsSpelled.contains(wordSpelled)) {


                                    if (areAllLettersInWord3(wordSpelled, randomWord)) {
                                        System.out.println("That's a word within the word. Awesome. ");
                                        wordsSpelled.add(wordSpelled);
                                        playerWordAmountArray[i]++;
                                        validWord = true;
                                        break;
                                    }


                                } else {
                                    System.out.println("\nYou already said that one. Nice try. You just dropped your count by one because of your stupidity.");
                                    playerWordAmountArray[i]--;
                                    validWord = true;
                                    break;
                                }
                            }
                        }


                        if (!validWord) {
                            System.out.println("Not a valid word. Your turn is over. You spelled " + playerWordAmountArray[i] + " words. ");
                            break;
                        }
                    }


                } // end for.   for players


                System.out.println("\n");

                if (playerWordAmountArray[0] > playerWordAmountArray[1]) {
                    System.out.println(currentPlayerName + " you have the most words so you keep your square! You: " + playerWordAmountArray[0] + " words. The loser: " + playerWordAmountArray[1] + " words. ");
                    return true;
                } else if (playerWordAmountArray[0] < playerWordAmountArray[1]) {
                    System.out.println(currentPlayerName + " you don't have the most words (You only have " + playerWordAmountArray[0] + " against " + playerWordAmountArray[1] + ") so you lose your square!");
                    return false;
                } else {
                    System.out.println("\n\nIt's a draw! You both spelled the same amount of letters. But we still need a winner. Let's both play a number game\n");

                    boolean currentPlayerBool = finalGuessNumber(playerCount, players, currentPlayerName, otherPlayerName, level);
                    System.out.println("\n\n");
                    boolean otherPlayerBool = finalGuessNumber(playerCount, players, otherPlayerName, otherPlayerName, level);

                    System.out.println();
                    if (!currentPlayerBool && otherPlayerBool) {
                        System.out.println(currentPlayerName + ", you didn't get the number but " + otherPlayerName + " did! You lose your square " + currentPlayerName);
                    } else if (currentPlayerBool && !otherPlayerBool) {
                        System.out.println(currentPlayerName + ", you got the number and " + otherPlayerName + " didn't. You get to keep your square " + currentPlayerName);
                    } else {

                        System.out.println("Another draw! That's crazyyyy.\n");
                        boolean currentPlayerBool2 = finalGuessNumber(playerCount, players, currentPlayerName, otherPlayerName, level);
                        System.out.println("\n\n");
                        boolean otherPlayerBool2 = finalGuessNumber(playerCount, players, otherPlayerName, otherPlayerName, level);

                        System.out.println();
                        if (!currentPlayerBool2 && otherPlayerBool2) {
                            System.out.println(currentPlayerName + ", you didn't get the number but " + otherPlayerName + " did! You lose your square " + currentPlayerName);
                        } else if (currentPlayerBool2 && !otherPlayerBool2) {
                            System.out.println(currentPlayerName + ", you got the number and " + otherPlayerName + " didn't. You get to keep your square " + currentPlayerName);
                        } else {
                            System.out.println("Another draw!!!!????! That's craAAAAAAzzyyyy.\n\nThat took soooooo long...\n\nTime for the coin.\n");
                            return FlipCoin(playerCount, players, currentPlayerName, otherPlayerName, level);
                        }

                    }

                } // draw


            } else {
                System.out.println("The file is empty.");
            }
        } catch (
                Exception e) {
            System.out.println("General error occurred.");
            throw new RuntimeException(e);
        }


        return false;
    }




    /**
     * Plays a wordle game via text for the current player
     *
     * @param playerCount # of players
     * @param players array of names
     * @param currentPlayerName the current player who will play this game
     * @param otherPlayerName the opponent, involved in some games
     * @param level levels 1-4
     * @return did the player win
     */
    public static boolean finalWordle(int playerCount, String[] players, String currentPlayerName, String otherPlayerName, int level) {
        WordleBool run = new WordleBool();

        if (currentPlayerName.equals("CPU")) { // make sure this index exist or error.
            String gameName = "Wordle"; // The "blank" Game
            return cpuGame(gameName, level);
        } else {
            return run.playGame(playerCount, players, currentPlayerName, otherPlayerName, level);
        }
    }




    /**
     * Plays a wordle game via the fancy UI for the current player
     *
     * yes there is that red text i dont know how to remove
     *
     * @param playerCount # of players
     * @param players array of names
     * @param currentPlayerName the current player who will play this game
     * @param otherPlayerName the opponent, involved in some games
     * @param level levels 1-4
     * @return did the player win
     */
    public static boolean finalWordleUI(int playerCount, String[] players, String currentPlayerName, String otherPlayerName, int level) {
        WordleUIBool wordle = new WordleUIBool();

        if (currentPlayerName.equals("CPU")) { // make sure this index exist or error.
            String gameName = "Wordle"; // The "blank" Game
            return cpuGame(gameName, level);
        } else {
            return wordle.playGame(playerCount, players, currentPlayerName, otherPlayerName, level);
        }
    }



    /**
     * Calls the Tic Tac Toe class for the two players. If only one players, calls the countries game instead.
     *
     * @param playerCount # of players
     * @param players array of names
     * @param currentPlayerName the current player who will play this game
     * @param otherPlayerName the opponent
     * @param level levels 1-4
     * @return did the player win
     */
    public static boolean finalTicTacToe(int playerCount, String[] players, String currentPlayerName, String otherPlayerName, int level) {
        TicTacToeBool run = new TicTacToeBool();

        if (currentPlayerName.equals("CPU")) { // make sure this index exist or error.
            String gameName = "Tic-Tac-Toe-within-a-Tic-Tac-Toe"; // The "blank" Game
            return cpuGame(gameName, level);
        } else if (players[1].equals("CPU")) {
            return finalCountries(playerCount, players, currentPlayerName, otherPlayerName, level);
        } else {
            return run.playGame(playerCount, players, currentPlayerName, otherPlayerName, level);
        }
    }




    /**
     * A game where you test how many long words you know
     *
     * @param playerCount # of players
     * @param players array of names
     * @param currentPlayerName the current player who will play this game
     * @param otherPlayerName the opponent, involved in some games
     * @param level levels 1-4: tries = 7 + level * 2
     * @return did the player win
     */
    public static boolean finalSpellHarderWords(int playerCount, String[] players, String currentPlayerName, String otherPlayerName, int level) {
        Scanner scanner = new Scanner(System.in);
        Random random = new Random();

        String[] cheers = {"Nice!", "Good job!", "Almost There!", "Well done.", "Keep it up!","You're doing great.","Good job "+currentPlayerName,"Nice job "+currentPlayerName+"!", "Well done "+currentPlayerName+"!","Awesome!" };
        int randomCheerInt = random.nextInt(cheers.length);
        String randomCheer = cheers[randomCheerInt];

        if (currentPlayerName.equals("CPU")) { // make sure this index exist or error.
            String gameName = "Spell-Words-Increasingly-Difficult"; // The "blank" Game
            return cpuGame(gameName, level);
        }

        System.out.println("Welcome to the Spell-Words-Increasingly-Difficult game!");

        String currentWorkingDir = System.getProperty("user.dir");
        String filePath = currentWorkingDir + "/src/Files/words.txt";
        try {
            // Read all lines from the file into a List
            List<String> lines = Files.readAllLines(Paths.get(filePath));
            if (!lines.isEmpty()) {
                int randomIndex = random.nextInt(lines.size());


                int tries = 7 + level * 2;
                System.out.println("Keeping spelling words until you spell a " + tries + " letter word.");
                boolean done = false;
                int amountOfLetters = 1 + level * 2;

                while (!done && amountOfLetters <= tries) {

                    System.out.print("Spell a " + amountOfLetters + " letter word: ");
                    String wordSpelled = scanner.nextLine();

                    boolean foundWord = false;

                    while (!foundWord) {
                        for (int i = 0; i < lines.size(); i++) {

                            String checkerWord = lines.get(i);

                            checkerWord = checkerWord.toLowerCase();
                            wordSpelled = wordSpelled.toLowerCase();

                            if (checkerWord.equals(wordSpelled)) {
                                if (wordSpelled.length() == amountOfLetters) {
                                    randomCheerInt = random.nextInt(cheers.length);
                                    randomCheer = cheers[randomCheerInt];
                                    System.out.println(randomCheer);
                                    foundWord = true;
                                    amountOfLetters++;
                                    break;
                                } else {
                                    System.out.print("Oops! That was the wrong length of word. \nWe are looking for "+amountOfLetters+", not "+wordSpelled.length()+". Try again.\n");
                                    foundWord = true;
                                }
                            }

                        }

                        if (foundWord) {
                            break;
                        } else {
                            System.out.println("Not a valid word. You loose :( ");
                            done = true;
                            return false;

                        }
                    } // end while found

                } // end while done

                System.out.println("You did it! Well done!!");
                return true;

            } else {
                System.out.println("The file is empty.");
            }
        } catch (Exception e) {
            System.out.println("General error occurred.");
            throw new RuntimeException(e);
        }


        return false;
    }



    /**
     * Just a coin flip
     *
     * @param playerCount # of players
     * @param players array of names
     * @param currentPlayerName the current player who will play this game
     * @param otherPlayerName the opponent, not involved in this one
     * @param level levels 1-4  not involved in this one
     * @return did the player win
     */
    public static boolean FlipCoin(int playerCount, String[] players, String currentPlayerName, String otherPlayerName, int level) {
        Random random = new Random();
        Scanner scanner = new Scanner(System.in);
        // Generate a random number: 0 or 1
        int coinFlip = random.nextInt(2); // 0 for heads, 1 for tails

        System.out.println("Let's flip a coin, " + currentPlayerName + "! Tails you loose your square, and heads, you keep it.\n\npress enter to flip the coin");

        scanner.nextLine();

        // Display the result
        if (coinFlip == 0) {
            System.out.println("Heads! You can keep your square " + currentPlayerName + ".");
            return true;
        } else if (coinFlip == 1) {
            System.out.println("Tails, you loose your square, " + currentPlayerName + ".");
            return false;
        } else {
            System.out.println("Problem!");
            return false;
        }

    }



    /**
     * A variation of the flip coin that has different words for the other context
     *
     * @param playerCount # of players
     * @param players array of names
     * @param currentPlayerName the current player who will flip the coin
     * @param otherPlayerName the opponent, not involved in this one
     * @param level levels 1-4
     * @return did the player win
     */
    public static boolean FlipCoinForChoice(int playerCount, String[] players, String currentPlayerName, String otherPlayerName, int level) {
        Random random = new Random();
        Scanner scanner = new Scanner(System.in);
        // Generate a random number: 0 or 1
        int coinFlip = random.nextInt(2); // 0 for heads, 1 for tails

        System.out.println("Let's flip a coin, " + currentPlayerName + ". Heads you can choose your game, and tails you get a random one. Sound good? \n\npress enter to flip the coin");

        scanner.nextLine();

        // Display the result
        if (coinFlip == 0) {
            System.out.println("Heads! You can choose your game " + currentPlayerName + ".\n\n");
            return true;
        } else if (coinFlip == 1) {
            System.out.println("Tails! Here's a random game " + currentPlayerName + ".\n\n");
            return false;
        } else {
            System.out.println("Problem!");
            return false;
        }

    }




    /**
     * @param playerCount # of players
     * @param players array of names
     * @param currentPlayerName the current player who will play this game
     * @param otherPlayerName the opponent, involved in some games
     * @param level levels 1-4
     * @return did the player win
     */
    public static boolean finalGuessNumber(int playerCount, String[] players, String currentPlayerName, String otherPlayerName, int level) {
        Scanner scanner = new Scanner(System.in);
        Random random = new Random();
        int gameSelector = 0;

        if (currentPlayerName.equals("CPU")) { // make sure this index exist or error.
            String gameName = "Number"; // The "blank" Game
            return cpuGame(gameName, level);
        } else if (players[1].equals("CPU")) { //meaning for One player

            int RandomOrPlayerGameSelector = random.nextInt(2);
            if (RandomOrPlayerGameSelector == 0) {

                System.out.print("You luckily get to decide.");
                while (true) {
                    System.out.print("\nSelect what game you want: \n1. Guess a number \n2. Higher or Lower \nChoose a number: ");
                    try {
                        gameSelector = scanner.nextInt() - 1;
                        scanner.nextLine();
                    } catch (Exception e) {
                        scanner.nextLine();
                    }
                    if (gameSelector == 0 || gameSelector == 1) {
                        break;
                    }
                }

            } else {
                gameSelector = random.nextInt(2);
            }
        } else {

            System.out.println("Welcome to The Number Games " + currentPlayerName + "!\n");


            int RandomOrPlayerGameSelector = random.nextInt(2);
            if (RandomOrPlayerGameSelector == 0) {

                System.out.print("You luckily get to decide.");
                while (true) {
                    System.out.print("\nSelect what game you want: \n1. Guess a number \n2. Higher or Lower \n3. Number Patterns  \nChoose a number: ");
                    try {
                        gameSelector = scanner.nextInt() - 1;
                        scanner.nextLine();
                    } catch (Exception e) {
                        scanner.nextLine();
                    }
                    if (gameSelector == 0 || gameSelector == 1 || gameSelector == 2) {
                        break;
                    }
                }

            } else {
                gameSelector = random.nextInt(3);
            }
        }

        //0 : 1 and 10 // 1: higher or lower // 2: number patterns
        if (gameSelector == 0) {


            // Generate random number between 1 and 10
            int randomNumber = random.nextInt(10) + 1;//if didn't add one then 0-9

//        System.out.println("Random number between 1 and 10: " + randomNumber);


            int tries = 7 - level;
            System.out.println("You have " + tries + " tries to guess this number between 1 and 10, "+currentPlayerName+".");


            for (int currentTry = 0; currentTry < tries; currentTry++) {

                System.out.print("\nGuess the number between 1 and 10: ");
                String input = scanner.nextLine();
                try {
                    // Attempt to convert the input string to an integer
                    int number = Integer.parseInt(input);
                    if (number > 0 && number <= 10) {
                        if (number == randomNumber) {
                            System.out.println("You guessed the number! You win.");
                            return true;
                        } else {
                            System.out.print("Not quite. ");
                        }

                    } else if (number == 0) {
                        System.out.println("You entered zero, which doesn't count. Sorry");
                    } else if (number < 0) {
                        System.out.println("You entered a negative number. That's not very positive.");
                    } else {
                        System.out.println("You entered a number outside of the bounds.");
                    }
                } catch (IllegalArgumentException e) {
                    System.out.println("That was not an integer! Enter a whole number that has no decimals. ");
                }

                String triesIncludeS = ((tries - 1 - currentTry) == 1) ? "" : "es";

                System.out.print("You have " + (tries - 1 - currentTry) + " guess" + triesIncludeS + " left. ");

            }

            System.out.println("You have you have ran out of guesses. You loose. The number was " + randomNumber);
            return false;

        } else if (gameSelector == 1) {
            //higher or lower.
            System.out.println("Let's play higher or lower, "+currentPlayerName+".\n");

            int tries = 5 + level;
            int randomNumber = 17;

            int topBound = 1;
            int bottomBound = 1;

            if (level == 1) {
                randomNumber = random.nextInt(100) + 1;
                tries = 8;
                topBound = 100;
                System.out.println("You have " + tries + " tries to guess this number between 1 and 100. \nIf the number is higher or lower then you set a new range to guess in. You got this. ");
            } else if (level == 2) {
                randomNumber = random.nextInt(1000) + 1;
                tries = 11;
                topBound = 1000;
                System.out.println("You have " + tries + " tries to guess this number between 1 and 1000. \nIf the number is higher or lower then you set a new range to guess in. ");
            } else if (level == 3) {
                randomNumber = random.nextInt(10000) + 1;
                tries = 14;
                topBound = 10000;
                System.out.println("You have " + tries + " tries to guess this number between 1 and 10,000. \nIf the number is higher or lower then you set a new range to guess in. Easy. ");
            } else if (level == 4) {
                randomNumber = random.nextInt(1000000) + 1;
                tries = 20;
                topBound = 1000000;
                System.out.println("You have " + tries + " tries to guess this number between 1 and 1,000,000. \nIf the number is higher or lower then you set a new range to guess in. Don't mess up. ");
            } else {
                System.out.println("Problem!");
            }


            for (int currentTry = 0; currentTry < tries; currentTry++) {

                System.out.print("\nGuess the number between " + bottomBound + " and " + topBound + ": ");
                String input = scanner.nextLine();
                try {
                    // Attempt to convert the input string to an integer
                    int number = Integer.parseInt(input);

                    if (number >= bottomBound && number <= topBound) {

                        if (number == randomNumber) {
                            System.out.println("You guessed the number! Congratulations!!!.");
                            return true;
                        } else {
                            if (number > randomNumber) {
                                System.out.print("Lower! ");
                                topBound = number;
                            } else {
                                System.out.print("Higher! ");
                                bottomBound = number;
                            }
                        }


                    } else if (number == 0) {
                        System.out.println("You entered zero, which doesn't count. Sorry");
                        currentTry--;
                    } else if (number < 0) {
                        System.out.println("You entered a negative number. That's not very positive. That was really silly.");
                        currentTry--;
                    } else {
                        System.out.println("You entered a number outside of the bounds. That was silly. ");
                        currentTry--;
                    }
                } catch (IllegalArgumentException e) {
                    System.out.println("That was not an integer! Enter a whole number that has no decimals. ");
                    currentTry--;
                }


                String triesIncludeS = ((tries - 1 - currentTry) == 1) ? "" : "es";

                System.out.print("You have " + (tries - 1 - currentTry) + " guess" + triesIncludeS + " left. ");

            }

            System.out.println("You have you have ran out of guesses. The number was " + randomNumber);
            return false;


        } else { // number patters


            System.out.println("Let's continue number patterns, "+currentPlayerName+". This is a hardcore mental math game.");


            String playingPlayer = currentPlayerName;

            System.out.println("  The goal is to get highest sum on the provided interval, higher than your opponent. Make sure to enter a bigger number each time!");

            int[] playerTotalNumber = new int[playerCount];
            for (int i = 0; i < playerCount; i++) {
                playerTotalNumber[i] = 0;
            }

            for (int i = 0; i < playerCount; i++) {

                if (i == 0) {
                    System.out.println("\nYou go first, " + currentPlayerName + ". If you get a higher number than " + otherPlayerName + " you win. ");
                } else {
                    playingPlayer = otherPlayerName;
                    System.out.println("\n\n" + playingPlayer + ", your turn! Try to get a higher number. ");
                }


                int interval = random.nextInt(10 * level) + 2;

                if (interval == 10) interval++;

                playerTotalNumber[i] = random.nextInt(10 * level) + 2;

                int playerSmallest = 0;

                while (true) {

//                    System.out.print("\n" + playingPlayer + ", Enter a number to add to " + playerTotalNumber[i] + " higher than " + playerTotalNumber[i] + " that is within the interval of " + interval + ": ");
                    System.out.print("\n" + playingPlayer + ", Let's make a sum of within the interval of "+interval+". Make sure to enter a bigger number each time! \nYour answer needs to add up to a number on the interval when also adding the number " + playerTotalNumber[i] + " to your number \n("+playerTotalNumber[i]+" + your_answer = something_on_interval_of_"+interval+") \nNot at all confusing!! You'll do great. Please enter your number: ");

                    String input = scanner.nextLine();

                    try {
                        // Attempt to convert the input string to an integer

                        int randomAdd = random.nextInt(10 * level) + 2;

                        int number = Integer.parseInt(input);
                        if (number > 0) {


                            if ((playerTotalNumber[i] + number) % interval == 0 && number > playerSmallest) {
                                System.out.println("Nice. "+number+" + "+playerTotalNumber[i]+" = "+(playerTotalNumber[i] + number)+" which can also be divided by "+interval+". That's your biggest sum so far. Add another.");
                                playerTotalNumber[i] = number+playerTotalNumber[i]+1;
                                playerSmallest = number;
                            } else {
                                if (number <= playerSmallest) {
                                    System.out.println("That number was definitely lower than " + playerSmallest + " you goose. Try again. You need a bigger one.");
                                } else {
                                    System.out.println("When you add "+number+" and "+playerTotalNumber[i]+" those numbers add to "+(playerTotalNumber[i] + number)+". That's not within the interval of " + interval + " because it can't by divided by "+interval+". Next turn");

                                    playerTotalNumber[i]--;
                                    break;
                                }
                            }


                        } else if (number == 0) {
                            System.out.println("You entered zero, which doesn't count. Sorry");
                        } else if (number < 0) {
                            System.out.println("You entered a negative number. That's not very positive. That was really silly.");
                        } else {
                            System.out.println("You entered a number outside of the bounds. That was silly. ");
                        }
                    } catch (IllegalArgumentException e) {
                        System.out.println("That was not an integer! Enter a whole number that has no decimals. ");
                    }

                }

            } // end for.   for players

            System.out.println("\n");

            if (playerTotalNumber[0] > playerTotalNumber[1]) {
                System.out.println(currentPlayerName + " you have the highest number so you keep your square! You: " + playerTotalNumber[0] + ". The loser: " + playerTotalNumber[1] + ". ");
                return true;
            } else if (playerTotalNumber[0] < playerTotalNumber[1]) {
                System.out.println(currentPlayerName + " you don't have the highest number (You only have " + playerTotalNumber[0] + " against " + playerTotalNumber[1] + ") so you lose your square!");
                return false;
            } else {
                System.out.println("\n\nIt's a draw! You both got the exact same number. But we still need a winner. Let's both play a number game\n");

                boolean currentPlayerBool = finalGuessNumber(playerCount, players, currentPlayerName, otherPlayerName, level);
                System.out.println("\n\n");
                boolean otherPlayerBool = finalGuessNumber(playerCount, players, otherPlayerName, otherPlayerName, level);

                System.out.println();
                if (!currentPlayerBool && otherPlayerBool) {
                    System.out.println(currentPlayerName + ", you didn't get the number but " + otherPlayerName + " did! You lose your square " + currentPlayerName);
                } else if (currentPlayerBool && !otherPlayerBool) {
                    System.out.println(currentPlayerName + ", you got the number and " + otherPlayerName + " didn't. You get to keep your square " + currentPlayerName);
                } else {

                    System.out.println("Another draw! That's crazyyyy.\n");
                    boolean currentPlayerBool2 = finalGuessNumber(playerCount, players, currentPlayerName, otherPlayerName, level);
                    System.out.println("\n\n");
                    boolean otherPlayerBool2 = finalGuessNumber(playerCount, players, otherPlayerName, otherPlayerName, level);

                    System.out.println();
                    if (!currentPlayerBool2 && otherPlayerBool2) {
                        System.out.println(currentPlayerName + ", you didn't get the number but " + otherPlayerName + " did! You lose your square " + currentPlayerName);
                    } else if (currentPlayerBool2 && !otherPlayerBool2) {
                        System.out.println(currentPlayerName + ", you got the number and " + otherPlayerName + " didn't. You get to keep your square " + currentPlayerName);
                    } else {
                        System.out.println("Another draw!!!!????! That's craAAAAAAzzyyyy.\n\nThis one little tic tac toe piece took soooooooo long....\n\nTime for the coin.\n");
                        return FlipCoin(playerCount, players, currentPlayerName, otherPlayerName, level);
                    }

                }

            } // draw


        }


        return false;
    }





    /**
     * level 1 easy 66.6% chance that the cpu loses
     * level 2 normal 50% chance that the cpu loses
     * level 3 difficult 40% chance that the cpu loses
     * level 4 implausible 30% chance that the cpu loses
     * @param gameName any minigame that was selected
     * @param level levels 1-4
     * @return did the cpu win
     */
    public static boolean cpuGame(String gameName, int level) {
        Random random = new Random();

        System.out.println("\n");
        if (level == 1) {
            int randomNumber = random.nextInt(3); // 66.6% chance to lose
            if (randomNumber == 0 || randomNumber == 1) {
                System.out.println("The CPU struggled in The " + gameName + " Game and lost!");
                return false;
            } else {
                System.out.println("The CPU played the " + gameName + " Game and sadly won.");
                return true;
            }
        } else if (level == 2) {
            int randomNumber = random.nextInt(2);  // 50% chance to lose
            if (randomNumber == 0) {
                System.out.println("The CPU played the " + gameName + " Game and lost!");
                return false;
            } else {
                System.out.println("The CPU did great the " + gameName + " Game and won.");
                return true;
            }
        } else if (level == 3) {
            int randomNumber = random.nextInt(5); // 40% chance to lose
            if (randomNumber == 0 || randomNumber == 1) {
                System.out.println("The CPU played the " + gameName + " Game and surprisingly lost!");
                return false;
            } else {
                System.out.println("The CPU rocked the " + gameName + " Game and won.");
                return true;
            }
        } else if (level == 4) {
            int randomNumber = random.nextInt(2);  //30% chance to lose
            if (randomNumber == 0) {
                System.out.println("The CPU played the " + gameName + " Game and somehow lost!!!???");
                return false;
            } else {
                System.out.println("The CPU demolished the " + gameName + " Game and won. Of course.");
                return true;
            }
        } else {
            System.out.println("Error: not a valid level/difficulty!");
        }


        return false;
    }


    /**
     * @param input aNy CaSE
     * @return Converted Case
     */
    public static String toTitleCase(String input) {
        StringBuilder titleCase = new StringBuilder(input.length());
        boolean nextTitleCase = true;

        for (char c : input.toCharArray()) {
            if (Character.isSpaceChar(c)) {
                nextTitleCase = true;
            } else if (nextTitleCase) {
                c = Character.toTitleCase(c);
                nextTitleCase = false;
            }

            titleCase.append(c);
        }

        return titleCase.toString();
    }


    // simple version no duplicate letters
    public static boolean areAllLettersInWord(String subWord, String mainWord) {
        int[] mainWordCounts = new int[26];

        // Count occurrences of each character in mainWord
        for (char c : mainWord.toLowerCase().toCharArray()) {
            mainWordCounts[c - 'a']++;
        }

        // Check if each character in subWord is in mainWord with enough occurrences
        for (char c : subWord.toLowerCase().toCharArray()) {
            if (--mainWordCounts[c - 'a'] < 0) {
                return false; // Not enough occurrences in mainWord
            }
        }
        return true;
    }

    // hash map version no duplicate letters
    public static boolean areAllLettersInWord2(String subWord, String mainWord) {
        // Convert mainWord to lowercase and count occurrences of each character
        HashMap<Character, Integer> mainWordCounts = new HashMap<>();
        for (char c : mainWord.toLowerCase().toCharArray()) {
            mainWordCounts.put(c, mainWordCounts.getOrDefault(c, 0) + 1);
        }

        // Check if each character in subWord is in mainWord with enough occurrences
        for (char c : subWord.toLowerCase().toCharArray()) {
            if (!mainWordCounts.containsKey(c) || mainWordCounts.get(c) <= 0) {
                return false; // Character missing or not enough occurrences
            }
            mainWordCounts.put(c, mainWordCounts.get(c) - 1); // Decrement count
        }
        return true;
    }

    // hash map version counts dad in dat
    public static boolean areAllLettersInWord3(String subWord, String mainWord) {
        // Convert mainWord to a set of unique characters
        HashSet<Character> mainWordSet = new HashSet<>();
        for (char c : mainWord.toLowerCase().toCharArray()) {
            mainWordSet.add(c);
        }

        // Check if each unique character in subWord is in mainWord
        for (char c : subWord.toLowerCase().toCharArray()) {
            if (!mainWordSet.contains(c)) {
                return false; // Character in subWord is not in mainWord
            }
        }
        return true;
    }

    // a test
    public void getLineTest() {
        String currentWorkingDir = System.getProperty("user.dir");
        String filePath = currentWorkingDir + "/src/Files/wordle.txt";
        Random random = new Random();

        try {
            // Read all lines from the file into a List

            List<String> lines = Files.readAllLines(Paths.get(filePath));

            // Check if the file is not empty
            if (!lines.isEmpty()) {
                // Get a random index
                int randomIndex = random.nextInt(lines.size());
                // Get the random line
                String randomLine = lines.get(randomIndex);
                // Print the random line
                System.out.println("Random line: " + randomLine);
            } else {
                System.out.println("The file is empty.");
            }
        } catch (NoSuchFileException e) {
            System.out.println("No such file: " + filePath + "\n\n");
            e.printStackTrace();
        } catch (IOException e) {
            System.out.println("An error occurred while reading the file.");
            e.printStackTrace();
        } catch (Exception e) {
            System.out.println("General error occurred.");
            throw new RuntimeException(e);
        }
    }



}

