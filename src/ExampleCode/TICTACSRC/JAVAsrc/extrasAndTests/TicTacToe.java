package extrasAndTests;

import java.util.Scanner;

public class TicTacToe {
    private char[][] board;
    private char currentPlayer;
    private boolean gameWon;

    // works only for 3 4 and 5 boards!!!!!!!!
    private int boardSize = 3;

    private String currentPlayerName;
    private String playerOne;
    private String playerTwo;
    private int playerOneWins = 0;
    private int playerTwoWins = 0;

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        TicTacToe game = new TicTacToe();
        game.playGame();

        scanner.close();
    } // end main method

   /* public TicTacToeTwo() {
        // these are the initial actions
        board = new char[boardSize][boardSize];
        initializeBoard();
    } */ // you can use this if you want. I just put it in the start of the play game instead

    // Main game loop
    public void playGame() {
        Scanner scanner = new Scanner(System.in);

        board = new char[boardSize][boardSize];
        initializeBoard();

        boolean playAgain;

        System.out.println("Welcome to Tic-Tac-Toe-Two!");

        System.out.print("Please enter Player One’s (X) name: ");
        playerOne = scanner.nextLine();

        System.out.print("Please enter Player Two’s (O) name: ");
        playerTwo = scanner.nextLine();


        do {
            gameWon = false;


            currentPlayer = 'X';
            currentPlayerName = playerOne;


            while (!gameWon && !checkDraw()) {
                displayBoard();
                System.out.print("\n" + currentPlayerName + ", enter your move (row (space) column): ");
                int row = scanner.nextInt() - 1; //adjust because first is zero
                int col = scanner.nextInt() - 1; //adjust because first is zero

                // Validate the move
                if (row >= 0 && row < boardSize && col >= 0 && col < boardSize && board[row][col] == ' ') {
                    board[row][col] = currentPlayer;
                    gameWon = checkWin();
                    if (!gameWon) {
                        switchPlayer();
                    }
                } else {
                    System.out.println("\nThis move is invalid. Try again.\n");
                }
            } // end while gameplay

            showWinnerScreen();

            scanner.nextLine(); // clear scanner
            System.out.print("\n\nPlay again? y/n: ");
            String againAnswer = scanner.nextLine();
            if (againAnswer.equals("y") || againAnswer.equals("Y") ||
                    againAnswer.equals("Yes") || againAnswer.equals("yes")) {
                playAgain = true;
                playAgainSetup();
            } else {
                System.out.println("Goodbye!");
                playAgain = false;
            }

        } while (playAgain);
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
        System.out.println("\nNew Board:");
        for (int i = 0; i < boardSize; i++) {
            for (int j = 0; j < boardSize; j++) {
                System.out.print(board[i][j]);
                if (j < boardSize - 1) System.out.print("|");
            }
            System.out.println();

            if (boardSize == 3) {
                if (i < boardSize - 1) System.out.println("-----");
            } else if (boardSize == 5) {
                if (i < boardSize - 1) System.out.println("---------");
            } else {
                if (i < boardSize - 1) System.out.println("-------");
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
        currentPlayerName = (currentPlayer == 'X') ? playerTwo : playerOne;
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

    public void showWinnerScreen(){

        displayBoard(); // final display showing the win




        if (gameWon) {
            System.out.println("\n\n" + currentPlayerName + " wins!!!");

            if (currentPlayer == 'X') {
                playerOneWins += 1;
                String playerOneIncludeS = (playerOneWins == 1) ? "" : "s";
                String playerTwoIncludeS = (playerTwoWins == 1) ? "" : "s";
                System.out.println("Well done " + playerOne + "! You have " + playerOneWins + " win" + playerOneIncludeS + ".");
                System.out.println("And good job " + playerTwo + ". You have " + playerTwoWins + " win" + playerTwoIncludeS + ".");
            } else if (currentPlayer == 'O') {
                playerTwoWins += 1;
                String playerOneIncludeS = (playerOneWins == 1) ? "" : "s";
                String playerTwoIncludeS = (playerTwoWins == 1) ? "" : "s";
                System.out.println("Well done " + playerTwo + "! You have " + playerTwoWins + " win" + playerTwoIncludeS + ".");
                System.out.println("And good job " + playerOne + ". You have " + playerOneWins + " win" + playerOneIncludeS + ".");
            }

            // if first play
            if ((playerOneWins == 0 && playerTwoWins == 1) ^ (playerOneWins == 1 && playerTwoWins == 0)){
                System.out.println("\nHow about we make this a two out of three game?");
            }

        } else {
            System.out.println("It's a draw!");
        }

    }

}

