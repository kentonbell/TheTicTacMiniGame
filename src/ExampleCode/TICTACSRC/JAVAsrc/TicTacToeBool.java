import java.util.Scanner;

public class TicTacToeBool {
    private char[][] board;
    private char currentPlayer;
    private boolean gameWon;

    private boolean finalWinBool;
    // works only for 3 4 and 5 boards!!!!!!!!
    private int boardSize = 3;
    private int levell;
    private int playerCountt;

    private String currentPlayerName2;
    private String playerOne;
    private String playerTwo;
    private String initialPlayer;
    private String initialOtherPlayer;
    private String[] playerss;



    public boolean playGame(int playerCount, String[] players, String currentPlayerName, String otherPlayerName, int level) {

        playerss = players;
        playerCountt = playerCount;
        levell = level;
        initialOtherPlayer = otherPlayerName;
        initialPlayer = currentPlayerName;

        Scanner scanner = new Scanner(System.in);


        System.out.println("Welcome to a game of Tic-Tac-Toe within a game of Tic-Tac-Toe!");

        if (players[0].equals(initialPlayer)) {
            playerOne = players[0];
            playerTwo = players[1];
        } else if (players[1].equals(initialPlayer)) {
            playerOne = players[1];
            playerTwo = players[0];

        } else {
            System.out.println("Error problem with initial player");
        }


        while (true) {
            System.out.print("\nSince this is your game, " + initialPlayer + ", what size of square tic-tac-toe board do you want? (3 or 4 or 5): ");
            try {
                boardSize = scanner.nextInt();
            } catch (Exception e) {
            }
            if (boardSize == 3 || boardSize == 4 || boardSize == 5) {
                break;
            }
        }

        board = new char[boardSize][boardSize];
        initializeBoard();


        gameWon = false;


        currentPlayer = 'X';
        currentPlayerName2 = playerOne;


        while (!gameWon && !checkDraw()) {
            displayBoard();

            int row;
            int col;
            while (true) {
                try {

                    System.out.print("\n" + currentPlayerName2 + " (" + currentPlayer + ") Enter what row you would like to play in: ");
                    row = scanner.nextInt() - 1; //adjust because first is zero
                    if (row < 0 || row > boardSize - 1) {
                        System.out.println("Invalid row input. Choose 1-" + boardSize);
                        scanner.nextLine();
                        continue;
                    }
                    scanner.nextLine();
                    System.out.print("" + currentPlayerName2 + " (" + currentPlayer + ") Enter what column you would like to play: ");
                    col = scanner.nextInt() - 1; //adjust because first is zero
                    if (col < 0 || col > boardSize - 1) {
                        System.out.println("Invalid column input. Choose 1-" + boardSize + ". Let's start over and enter the row");
                        scanner.nextLine();
                        continue;
                    }
                    scanner.nextLine();
                    break;
                } catch (Exception e) {
                    scanner.nextLine();
                    System.out.println("Invalid input. Choose 1-" + boardSize);
                }
            }

            // Validate the move
            if (row >= 0 && row < boardSize && col >= 0 && col < boardSize && board[row][col] == ' ') {
                board[row][col] = currentPlayer;
                gameWon = checkWin();
                if (!gameWon) {
                    switchPlayer();
                }
            } else {
                System.out.println("\nThis move is invalid. Try AGAAIN.\n");
            }
        } // end while gameplay

        return showWinnerScreen();


    }


    // Initialize the board with empty spaces
    private void initializeBoard() {
        // i is rows
        // j is columns
        for (int i = 0; i < boardSize; i++) {
            for (int j = 0; j < boardSize; j++) {
                board[i][j] = ' ';
            }
        }
    }


    // Display the current board
    public void displayBoard() {
        System.out.println("\nThe Board Within The Board:");
        for (int i = 0; i < boardSize; i++) {
            for (int j = 0; j < boardSize; j++) {
                System.out.print(board[i][j]);
                if (j < boardSize - 1) System.out.print("|");
            }
            System.out.println();

            if (boardSize == 3) {
                if (i < boardSize - 1) System.out.println("- - -");
            } else if (boardSize == 5) {
                if (i < boardSize - 1) System.out.println("- - - - -");
            } else {
                if (i < boardSize - 1) System.out.println("- - - -");
            }
        }
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
//                    System.out.println("Checking draw");
                    return false; // Found an empty space
                }
            }
        }
        return true; // No empty spaces left
    }

    public void switchPlayer() {
        // this is a ternary operator meaning: If cP equals then X then O else then X
        currentPlayerName2 = (currentPlayer == 'X') ? playerTwo : playerOne;
        currentPlayer = (currentPlayer == 'X') ? 'O' : 'X';
    }

    public void playAgainSetup() {

        if (boardSize == 3) {
            boardSize = 4;
            System.out.println("\n\nNow we're upping the grid to a 4x4!");
        } else if (boardSize == 4) {
            boardSize = 5;
            System.out.println("\n\nNow we're upping the grid to a 5x5!!!");
        } else if (boardSize == 5) {
            boardSize = 3;
            System.out.println("\n\nLet's make the grid a 3x3 now");
        }

        board = new char[boardSize][boardSize];
        initializeBoard();
    }

    public boolean showWinnerScreen() {

        displayBoard(); // final display showing the win


        if (gameWon) {
            System.out.println("\n\n" + currentPlayerName2 + " wins!!!");

            if (currentPlayerName2.equals(initialPlayer)) {
                System.out.println("\nWell done, " + initialPlayer + ", you win the mini game! \n\nThat means you can keep your square on the other board.");
                return true;
            } else {
                System.out.println("\nYou lost, " + initialPlayer + ". You loose that other tic tac toe square.");
                return false;
            }

        } else {
            System.out.println("\n\nIt's a draw! But we still need a winner. Let's both play a number game\n");

            boolean currentPlayerBool = MiniGames.finalGuessNumber(playerCountt, playerss, initialPlayer, initialOtherPlayer, levell);
            System.out.println("\n\n");
            boolean otherPlayerBool = MiniGames.finalGuessNumber(playerCountt, playerss, initialOtherPlayer, initialPlayer, levell);

            System.out.println();
            if (!currentPlayerBool && otherPlayerBool) {
                System.out.println(initialPlayer+", you didn't get the number but " + initialOtherPlayer + " did! You lose your square " + initialPlayer);
            } else if (currentPlayerBool && !otherPlayerBool) {
                System.out.println(initialPlayer+", you got the number and " + initialOtherPlayer + " didn't. You get to keep your square " + initialPlayer);
            } else {

                System.out.println("Another draw! That's crazyyyy. Let's do it again!!\n");
                boolean currentPlayerBool2 = MiniGames.finalGuessNumber(playerCountt, playerss, initialPlayer, initialOtherPlayer, levell);
                System.out.println("\n\n");
                boolean otherPlayerBool2 = MiniGames.finalGuessNumber(playerCountt, playerss, initialOtherPlayer, initialPlayer, levell);

                System.out.println();
                if (!currentPlayerBool2 && otherPlayerBool2) {
                    System.out.println(initialPlayer+", you didn't get the number but " + initialOtherPlayer + " did! You lose your square " + initialPlayer);
                } else if (currentPlayerBool2 && !otherPlayerBool2) {
                    System.out.println(initialPlayer+", you got the number and " + initialOtherPlayer + " didn't. You get to keep your square " + initialPlayer);
                } else {
                    System.out.println("Another draw!!!!????! That's craAAAAAAzzyyyy.\n\nTime for the coin.\n");
                    return MiniGames.FlipCoin(playerCountt, playerss, initialPlayer, initialOtherPlayer, levell);
                }

            }

        }


        return false;
    }

}

