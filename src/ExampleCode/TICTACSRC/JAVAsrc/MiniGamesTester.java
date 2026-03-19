import java.io.IOException;

public class MiniGamesTester {

    public static void main(String[] args) throws IOException {


//        MiniGames run = new MiniGames();

        String playerOne = "Kenton";
        String playerTwo = "kejee";
        int playerCount = 2;

        String[] players = {playerOne,playerTwo};

        String otherplayer = playerOne;

        String currentPlayer = "kejee";

        int level = 4;

        if (MiniGames.finalUnscrambleWord(playerCount, players, currentPlayer, otherplayer, level)) {
            System.out.println("\nTester: True");
        } else {System.out.println("\nTester: False");}


        if (MiniGames.finalUnscrambleWord(playerCount, players, currentPlayer, otherplayer, level)) {
            System.out.println("\nTester: True");
        } else {System.out.println("\nTester: False");}



        if (MiniGames.finalUnscrambleWord(playerCount, players, currentPlayer, otherplayer, level)) {
            System.out.println("\nTester: True");
        } else {System.out.println("\nTester: False");}




    }


}

