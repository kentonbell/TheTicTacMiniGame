import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.Scanner;
import java.util.*;

public class Main {
    public char[][] board;
    public char currentPlayer;
    public boolean gameWon;


    // works only for 3 4 and 5 boards!!!!!!!!
    public int boardSize;

    public static int gameCount = 1;

    public static int playerCount;
    public static String currentPlayerName;
    public static String otherPlayerName;
    public static String playerOne;
    public static String playerTwo;
    public int playerOneWins = 0;
    public int playerTwoWins = 0;
    public static String[] players = {playerOne, playerTwo};
    public static int move = 0;
    public static int row = 0;
    public static int col = 0;
    public static boolean didChooseRandomGame = false;

    public static boolean winnerResult;

    public static int level; //difficulty levels 1. easy 2. medium 3. hard. 4. Implausible

    public static void main(String[] args) throws Exception {
        Scanner scanner = new Scanner(System.in);

        Main game = new Main();
        game.playGame(scanner);

        scanner.close();
    } // end main method


    // Main game loop
    public void playGame(Scanner scanner) throws Exception {

        System.out.println("\nWelcome to The Mini-Tiny Challenge! \n The goal is to win this game of tic-tac-toe. But within each move you make is another game to play.");
        System.out.println("\n\npress enter to start...");
        scanner.nextLine();

        setupGame(scanner);

        System.out.println("\nIf you want to keep the square that you pick, you will have to win the game within the square that you choose!");
        System.out.println("\npress enter to continue...");
        scanner.nextLine();


        boolean playAgain;
        do {
            gameWon = false;

            currentPlayer = 'X';
            currentPlayerName = playerOne;
            otherPlayerName = playerTwo;


            while (!gameWon && !checkDraw()) { // gameplay
                gameWon = checkWin();
                if (gameWon && !checkDraw()) {
                    break;
                }
                displayBoard();


                chooseSquare(scanner);


                // Validate the move
                if (row >= 0 && row < boardSize && col >= 0 && col < boardSize && board[row][col] == ' ') {

                    System.out.println();
                    Thread.sleep(500);
                    getGame(); ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                    if (!winnerResult) { // false //to show loss
                        switchPlayer();
                    }
                    board[row][col] = currentPlayer;
                    if (!winnerResult) { // false //to put it back to the correct player after showing loss
                        switchPlayer();
                    }

                    gameWon = checkWin();
                    if (!gameWon) {
                        switchPlayer();
                        Thread.sleep(1000);
                    }
                } else {
                    System.out.println("\nThis move is invalid. Try AGAIN.\n");
                }
            } // end while gameplay


            showWinnerScreen();

            System.out.print("\n\nPlay again? Yes or no: ");
            String againAnswer = scanner.nextLine();
            if (againAnswer.equals("y") || againAnswer.equals("Y") ||
                    againAnswer.equals("Yes") || againAnswer.equals("yes")) {

                playAgainSetup(scanner);
                playAgain = true;

            } else {
                System.out.println("I hope you enjoyed! Come again soon! \n\nGoodbye!");
                playAgain = false;
            }

        } while (playAgain);
    }


    public void setupGame(Scanner scanner) throws Exception {


        while (true) {
            System.out.print("How many players (1 or 2): ");
            try {
                playerCount = scanner.nextInt();
            } catch (Exception e) {
                scanner.nextLine();
            }
            if (playerCount == 1 || playerCount == 2) {
                break;
            }
        }

        while (true) {
            System.out.print("Select your difficulty: \n1. Easy \n2. Medium \n3. Hard \n4. Implausible \nChoose a number: ");
            try {
                level = scanner.nextInt();
            } catch (Exception e) {
                scanner.nextLine();
            }
            if (level == 1 || level == 2 || level == 3 || level == 4) {
                break;
            }
        }

        if (playerCount == 0) { ///not used////////////////////////////////////////////////////////////////////////////////
            while (true) {
                System.out.print("Since we're playing alone, let's make it interesting. \n      What size of square tic-tac-toe board do you want? (3, 4, or 5): ");
                try {
                    boardSize = scanner.nextInt();
                } catch (Exception e) {
                    scanner.nextLine();
                }
                if (boardSize == 3 || boardSize == 4 || boardSize == 5) {
                    break;
                }
            }
        } /*not used/////////*/else boardSize = 3;

        initializeBoard();

        scanner.nextLine();
        System.out.print("Please enter Player One’s (X) name: ");
        playerOne = scanner.nextLine();

        if (playerCount == 2) {
            System.out.print("Please enter Player Two’s (O) name: ");
            playerTwo = scanner.nextLine();
        } else {
            playerTwo = "CPU";
            playerCount = 2; //override
            System.out.println("You're playing against the CPU (playing as 'O').");
            Thread.sleep(2000);
        }


        players = new String[]{playerOne, playerTwo};

    }


    // Initialize the board with empty spaces
    private void initializeBoard() {
        board = new char[boardSize][boardSize];
        // i is rows
        // j is columns
        for (int i = 0; i < boardSize; i++) {
            for (int j = 0; j < boardSize; j++) {
                board[i][j] = ' ';
            }
        }
    }


    public void chooseSquare(Scanner scanner) throws Exception {
        //initialize row/col
        row = 0;
        col = 0;

        if (currentPlayerName != "CPU") {
            while (true) {
                try {

                    System.out.print("\n" + currentPlayerName + " (" + currentPlayer + ") Enter what row you would like to play in: ");
                    row = scanner.nextInt() - 1; //adjust because first is zero
                    if (row < 0 || row > boardSize - 1) {
                        System.out.println("Invalid row input. Choose 1-" + boardSize);
                        scanner.nextLine();
                        continue;
                    }
                    scanner.nextLine();
                    System.out.print("" + currentPlayerName + " (" + currentPlayer + ") Enter what column you would like to play: ");
                    col = scanner.nextInt() - 1; //adjust because first is zero
                    if (col < 0 || col > boardSize - 1) {
                        System.out.println("Invalid column input. Choose 1-" + boardSize);
                        scanner.nextLine();
                        continue;
                    }
                    scanner.nextLine();
                    break;
                } catch (Exception e) {
                    scanner.nextLine();
                    System.out.println("Invalid input. That's not even a number. Choose 1-" + boardSize);
                }
            }
        } else { // cpu play
            Random random = new Random();
            while (true) {
                row = random.nextInt(boardSize);
                col = random.nextInt(boardSize);
                if (row >= 0 && row < boardSize && col >= 0 && col < boardSize && board[row][col] == ' ') {
                    System.out.println("\n\n\nThe CPU is playing a game...");
                    Thread.sleep(7000);
                    System.out.println();
                    break;
                }
            }
        }
    }


    // Display the current board
    public void displayBoard() throws InterruptedException {
        int slashAmount = 30;
        String boardIndent = "           ";
        System.out.println();
        for (int i = 0; i < slashAmount; i++) {
            System.out.print("/\\");
            Thread.sleep(70);
        }

        System.out.println("\nThe Mini-Tiny Challenge Board:");
        Thread.sleep(500);

        if (move <= 1) {
            System.out.print("Column:         1  2  3 \n");
            Thread.sleep(500);
        }

        for (int i = 0; i < boardSize; i++) {
            if (move <= 1) {
                System.out.print("Row "+ (i+1) +":");
            }
            System.out.print(boardIndent);
            for (int j = 0; j < boardSize; j++) {
                System.out.print(board[i][j]);
                if (j < boardSize - 1) System.out.print("|");
            }

            System.out.println();

            Thread.sleep(500);

            if (i < boardSize - 1) System.out.print(boardIndent);

            if (move <= 1 && i < boardSize - 1) {System.out.print("      ");}

            if (boardSize == 3) {
                if (i < boardSize - 1) System.out.println("-----");
            } else if (boardSize == 5) {
                if (i < boardSize - 1) System.out.println("---------");
            } else {
                if (i < boardSize - 1) System.out.println("-------");
            }
            if (i < boardSize - 1) Thread.sleep(500);
        }
        for (int i = 0; i < slashAmount; i++) {
            System.out.print("/\\");
            Thread.sleep(0);
        }
//        Thread.sleep(500);
    }


    public boolean checkWin() {
        // Check rows and columns
        for (int i = 0; i < boardSize; i++) {
            if ((board[i][0] == currentPlayer && board[i][1] == currentPlayer && board[i][2] == currentPlayer && board[i][boardSize - 1] == currentPlayer && board[i][boardSize - 2] == currentPlayer) ||
                    (board[0][i] == currentPlayer && board[1][i] == currentPlayer && board[2][i] == currentPlayer && board[boardSize - 1][i] == currentPlayer && board[boardSize - 2][i] == currentPlayer)) {
                return true;
            }
        }

        // Check diagonals
        if ((board[0][0] == currentPlayer && board[1][1] == currentPlayer && board[2][2] == currentPlayer && board[boardSize - 1][boardSize - 1] == currentPlayer && board[boardSize - 2][boardSize - 2] == currentPlayer) ||
                (board[0][boardSize - 1] == currentPlayer && board[1][boardSize - 2] == currentPlayer && board[boardSize - 1][0] == currentPlayer && board[2][boardSize - 3] == currentPlayer && board[boardSize - 2][1] == currentPlayer)) {
            return true;
        }

        return false;
    }

    public boolean checkDraw() {
        for (int i = 0; i < boardSize; i++) {
            for (int j = 0; j < boardSize; j++) {
                if (board[i][j] == ' ') {
                    return false; // Found an empty space
                }
            }
        }
        return true; // No empty spaces left
    }

    public void switchPlayer() {
        // this is a ternary operator meaning: If cP equals then X then O else then X
        currentPlayerName = (currentPlayer == 'X') ? playerTwo : playerOne;
        otherPlayerName = (currentPlayer == 'X') ? playerOne : playerTwo;
        currentPlayer = (currentPlayer == 'X') ? 'O' : 'X';
    }


    /**
     * playAgainSetup, obviously :)
     */
    public void playAgainSetup(Scanner scanner) throws Exception {

        System.out.print("\nWould you like to change the difficulty: ");
        String againAnswerD = scanner.nextLine();
        if (againAnswerD.equals("y") || againAnswerD.equals("Y") ||
                againAnswerD.equals("Yes") || againAnswerD.equals("yes")) {
            while (true) {
                System.out.print("Select your difficulty: \n1. Easy \n2. Medium \n3. Hard \n4. Implausible \nChoose a number: ");
                try {
                    level = scanner.nextInt();
                } catch (Exception e) {
                    scanner.nextLine();
                }
                if (level == 1 || level == 2 || level == 3 || level == 4) {
                    break;
                }
            }
        }

        gameCount++;
        System.out.println("\n\nRound " + gameCount + "! ");
        Thread.sleep(2000);

        playAgainBoardSetup();
    }


    /**
     * playAgainBoardSetup, obviously :)
     */
    public void playAgainBoardSetup() {

        if (boardSize == 3) {
            boardSize = 4;
            System.out.println("\n\nNow we're upping the grid to a 4x4!");
        } else if (boardSize == 4) {
            boardSize = 5;
            System.out.println("\n\nNow we're upping the grid to a 5x5!!!");
        } else if (boardSize == 5) {
            boardSize = 3;
            System.out.println("\n\nLet's make the grid a 3x3 now. We don't want to make things too crazy...");
        }

        board = new char[boardSize][boardSize];
        initializeBoard();

        didChooseRandomGame = false;
    }


    /**
     * States who wins and how many wins
     *
     * @throws InterruptedException necessary for the sleep function.
     */
    public void showWinnerScreen() throws InterruptedException {

        displayBoard(); // final display showing the win


        if (gameWon) {
            System.out.println("\n\n" + currentPlayerName + " wins!!!");


            System.out.println();
            if (currentPlayer == 'X') {
                playerOneWins += 1;
                String playerOneIncludeS = (playerOneWins == 1) ? "" : "s";
                String playerTwoIncludeS = (playerTwoWins == 1) ? "" : "s";
                System.out.println("Well done " + playerOne + " for winning! You have " + playerOneWins + " win" + playerOneIncludeS + ".\n");
                Thread.sleep(300);
                if (playerTwoWins == 0) {
                    System.out.println(playerTwo + ", you have " + playerTwoWins + " win" + playerTwoIncludeS + ". It's time to step it up a little.");
                } else {
                    System.out.println("And good job " + playerTwo + ". You have " + playerTwoWins + " win" + playerTwoIncludeS + ".");
                }

            } else if (currentPlayer == 'O') {
                playerTwoWins += 1;
                String playerOneIncludeS = (playerOneWins == 1) ? "" : "s";
                String playerTwoIncludeS = (playerTwoWins == 1) ? "" : "s";
                System.out.println("Well done " + playerTwo + " for winning this one! You have " + playerTwoWins + " win" + playerTwoIncludeS + ".\n");
                Thread.sleep(300);
                if (playerOneWins == 0) {
                    System.out.println(playerOne + ", you have " + playerOneWins + " win" + playerOneIncludeS + ". That's sad :(");
                } else {
                    System.out.println("And good job " + playerOne + ". You have " + playerOneWins + " win" + playerOneIncludeS + ".");
                }

            }

            // for first play
            if ((playerOneWins == 0 && playerTwoWins == 1) ^ (playerOneWins == 1 && playerTwoWins == 0)) {

                System.out.println("\n\nHow about we make this a two out of three game?\n");

            }

        } else {
            System.out.println("\n\nIt's a draw!!? It's time to go again so we can see who is better.");

        }

    }


    /**
     * The logic for if the user gets to choose their game or gets a random one.
     *
     * @throws Exception for if it doesn't work
     */
    public static void getGame() throws Exception {

        if (currentPlayerName.equals("CPU")) {
            getRandomGame();
            return;
        }


        if (move < 4) {
            move++;
            System.out.println("\nLet's choose what game you want to play!");

            winnerResult = chooseGameFromThree();
            if (didChooseRandomGame) getRandomGame();
            didChooseRandomGame = false;

        } else {
            move++;
            if (MiniGames.FlipCoinForChoice(playerCount, players, currentPlayerName, otherPlayerName, level)) {
                winnerResult = chooseGameFromThree();
            } else {
                getRandomGame();
            }

        }
    }

    /**
     * Plays the game the user chooses
     *
     * @return true false of if they won the game they selected
     * @throws Exception
     */
    public static boolean chooseGame() throws Exception {
        Scanner scanner = new Scanner(System.in);
        String[] choices = {"1. Countries\n",
                "2. Unscramble Words\n",
                "3. Anagrams\n",
                "4. Wordle\n",
                "5. Wordle (with graphics!) \n",
                "6. Tic Tac Toe\n",
                "7. Flip A Coin\n",
                "8. Spell Harder Words\n",
                "9. Guess A Number\n",
                "0. A Random Game\n"
        };
        String choice;

        for (String option : choices) {
            System.out.print(option);
        }
        do {
            // Display the choices
            System.out.print("\nPlease select an option: ");


            // Get user input
//            System.out.print("Enter your choice: ");
            choice = scanner.next();

//            System.out.print("\n");

            // Process the user's choice
            switch (choice) {
                case "1":
                    return MiniGames.finalCountries(playerCount, players, currentPlayerName, otherPlayerName, level);

                case "2":
                    return MiniGames.finalUnscrambleWord(playerCount, players, currentPlayerName, otherPlayerName, level);
                case "3":
                    if (players[1].equals("CPU")) {
                        System.out.print("Anagrams is only available for two players. We will have to re-prompt you. Sorry!");
                        break;
                    }
                    return MiniGames.finalAnagrams(playerCount, players, currentPlayerName, otherPlayerName, level);
                case "4":
                    return MiniGames.finalWordle(playerCount, players, currentPlayerName, otherPlayerName, level);
                case "5":
                    return MiniGames.finalWordleUI(playerCount, players, currentPlayerName, otherPlayerName, level);
                case "6":
                    if (players[1].equals("CPU")) {
                        System.out.print("Since TicTacToe only works with two players, we will re-prompt you. Sorry!!");
                        break;
                    }
                    return MiniGames.finalTicTacToe(playerCount, players, currentPlayerName, otherPlayerName, level);
                case "7":
                    return MiniGames.FlipCoin(playerCount, players, currentPlayerName, otherPlayerName, level);
                case "8":
                    return MiniGames.finalSpellHarderWords(playerCount, players, currentPlayerName, otherPlayerName, level);
                case "9":
                    return MiniGames.finalGuessNumber(playerCount, players, currentPlayerName, otherPlayerName, level);
                case "0":
                    didChooseRandomGame = true;
                    System.out.println();
                    return true;
                default:
                    System.out.print("\nInvalid choice, please choose one of the available numbers.");
            }
            System.out.println(); // Add a blank line for better readability
        } while (true); // Repeat forever.

    }

    public static boolean chooseGameFromThree() throws Exception {
        Scanner scanner = new Scanner(System.in);
        Random random = new Random();

        ///////There is the same likelihood for any of the 9 games.

//        String[] choicesString = {"1. Countries\n",
//                "2. Unscramble Words\n",
//                "3. Anagrams\n",
//                "4. Wordle\n",
//                "5. Wordle (with graphics!) \n",
//                "6. Tic Tac Toe\n",
//                "7. Flip A Coin\n",
//                "8. Spell Harder Words\n",
//                "9. Guess A Number\n",
//                "0. A Random Game\n"
//        };
        String[] choices = {
                "Name Countries",
                "Flip A Coin",
                "Guess A Number",
                "Unscramble Words",
                "Spell Harder Words",
                "Anagrams",
                "Wordle",
                "Wordle (with graphics!)",
                "Tic Tac Toe (a game within a game!)"
        };

        int randomizeChoices = random.nextInt(3);
        if (randomizeChoices == 1) {
            choices = new String[] {
                    "Unscramble Words",
                    "Spell Harder Words",
                    "Anagrams",
                    "Name Countries",
                    "Flip A Coin",
                    "Guess A Number",
                    "Wordle",
                    "Wordle (with graphics!)",
                    "Tic Tac Toe (a game within a game!)"
            };
        } else if (randomizeChoices == 2) {
            choices = new String[] {
                    "Unscramble Words",
                    "Spell Harder Words",
                    "Anagrams",
                    "Wordle",
                    "Wordle (with graphics!)",
                    "Tic Tac Toe (a game within a game!)",
                    "Name Countries",
                    "Flip A Coin",
                    "Guess A Number"
            };
        } //leave same if zero


        String choice; //must be declared earlier

        int randomNumber1 = random.nextInt(3);
        int randomNumber2 = random.nextInt(3) + 3;
        int randomNumber3 = random.nextInt(3) + 6;

        //System.out.println("The random numbers are: "+ randomNumber1 + ", " + randomNumber2 + ", " + randomNumber3);



        String[] options = {choices[randomNumber1], choices[randomNumber2], choices[randomNumber3]};

        int surpriseGame = 0;
        if (move > 2) surpriseGame = random.nextInt(3);
        if (move > 5) surpriseGame = random.nextInt(9);

        System.out.println("\n0. A Random Game");
        for (int i = 0; i < options.length; i++) {
            String option = options[i];
            System.out.println((1+i)+". "+option);
        }
        if (surpriseGame == 2){
            System.out.println("4. A Surprise Game!");
        }

        do {
            // Display the choices
            System.out.print("\nPlease select an option: ");


            // Get user input
//            System.out.print("Enter your choice: ");
            choice = scanner.next();

            System.out.println("\n");

            if (choice != "0"){
                switch (choice) {
                    case "1":
                        choice = choices[randomNumber1];
                        break;
                    case "2":
                        choice = choices[randomNumber2];
                        break;
                    case "3":
                        choice = choices[randomNumber3];
                        break;
                    case "4":
                        if (surpriseGame == 2){
                            choice = "0";
                            System.out.println("\nExcellent Choice To Choose The Surprise!!\n");
                        }
                    default:
                }
            }

//            System.out.print("\n");

            // Process the user's choice
            switch (choice) {
                case "Name Countries":
                    return MiniGames.finalCountries(playerCount, players, currentPlayerName, otherPlayerName, level);

                case "Unscramble Words":
                    return MiniGames.finalUnscrambleWord(playerCount, players, currentPlayerName, otherPlayerName, level);
                case "Anagrams":
                    if (players[1].equals("CPU")) {
                        System.out.print("Anagrams is only available for two players. We will have to re-prompt you. Sorry!");
                        break;
                    }
                    return MiniGames.finalAnagrams(playerCount, players, currentPlayerName, otherPlayerName, level);
                case "Wordle":
                    return MiniGames.finalWordle(playerCount, players, currentPlayerName, otherPlayerName, level);
                case "Wordle (with graphics!)":
                    return MiniGames.finalWordleUI(playerCount, players, currentPlayerName, otherPlayerName, level);
                case "Tic Tac Toe (a game within a game!)":
                    if (players[1].equals("CPU")) {
                        System.out.print("Since TicTacToe only works with two players, we will re-prompt you. Sorry!!");
                        break;
                    }
                    return MiniGames.finalTicTacToe(playerCount, players, currentPlayerName, otherPlayerName, level);
                case "Flip A Coin":
                    return MiniGames.FlipCoin(playerCount, players, currentPlayerName, otherPlayerName, level);
                case "Spell Harder Words":
                    return MiniGames.finalSpellHarderWords(playerCount, players, currentPlayerName, otherPlayerName, level);
                case "Guess A Number":
                    return MiniGames.finalGuessNumber(playerCount, players, currentPlayerName, otherPlayerName, level);
                case "0":
                    didChooseRandomGame = true;
                    System.out.println();
                    return true;
                default:
                    System.out.print("Invalid choice, please choose one of the available numbers.");
            }
            System.out.println(); // Add a blank line for better readability
        } while (true); // Repeat forever.

    }

    /**
     * Gets and plays a random game
     *
     * @throws Exception for if it doesn't work
     */
    public static void getRandomGame() throws Exception {
        Method[] gamesList = MiniGames.class.getDeclaredMethods();
        List<Method> finalGamesList = new ArrayList<>();

        for (Method game : gamesList) {
            if (game.getName().startsWith("final") && game.getReturnType() == boolean.class) {
                finalGamesList.add(game);
            }
        }
        Random random = new Random();
        Method randomGame = finalGamesList.get(random.nextInt(finalGamesList.size()));
        // Invoke the selected method and get its boolean result
        winnerResult = (boolean) randomGame.invoke(null, playerCount, players, currentPlayerName, otherPlayerName, level);
//        System.out.println("Selected " + randomGame.getName() + " returned: " + winnerResult);


    }

}

