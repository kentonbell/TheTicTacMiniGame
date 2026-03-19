package extrasAndTests;

public class StringSelectorTest {

    public static String getString(String input) {
        switch (input.toLowerCase()) {
            case "hello":
                return "You selected 'Hello'!";
            case "goodbye":
                return "You selected 'Goodbye'!";
            case "java":
                return "You selected 'Java'!";
            default:
                return "Unknown selection!";
        }
    }

    public static void main(String[] args) {
        System.out.println(getString("hello"));    // Output: You selected 'Hello'!
        System.out.println(getString("java"));     // Output: You selected 'Java'!
        System.out.println(getString("something")); // Output: Unknown selection!
    }
}
