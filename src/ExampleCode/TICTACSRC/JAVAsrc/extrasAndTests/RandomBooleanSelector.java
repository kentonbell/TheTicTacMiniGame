package extrasAndTests;

import java.lang.reflect.Method;
import java.util.*;

public class RandomBooleanSelector {

    ////////////////////////////not using this. This was a smaller test. ////////////////////////////////////////////////////////////////////////////////////////////////////////////////


    public static  String playerOne = "Kenton";
    public static  String playerTwo = "billy";
    public static  int playerCount = 2;

    public static  String currentPlayer = "Kenton";

    public static  String[] players = {playerOne,playerTwo};

    //difficulty levels 1. easy 2. medium 3. hard. 4. Implausible
    public static  int level = 2;

    public static boolean winnerResult;


    public static void main(String[] args) throws Exception {
        // Get all methods starting with "method"




//        runActionss();

        System.out.println("Final: " + winnerResult);




    }


//    public static void runActionss() throws Exception {
//
//        Method[] gamesList = MiniGames.class.getDeclaredMethods();
//        List<Method> finalGamesList = new ArrayList<>();
//
//        for (Method game : gamesList) {
//            if (game.getName().startsWith("final") && game.getReturnType() == boolean.class) {
//                finalGamesList.add(game);
//            }
//        }
//        Random random = new Random();
//        Method randomGame = finalGamesList.get(random.nextInt(finalGamesList.size()));
//        // Invoke the selected method and get its boolean result
//        boolean result = (boolean) randomGame.invoke(null, playerCount, players, currentPlayer, level);
//        System.out.println("Selected " + randomGame.getName() + " returned: " + result);
//
//        winnerResult = result;
//    }

}