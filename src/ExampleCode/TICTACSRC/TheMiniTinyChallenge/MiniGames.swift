//
//  MiniGames.swift
//  TheMiniTinyChallenge
//
//  Created by Kenton Bell on 9/26/25.
//

import SwiftUI



enum MiniGameType: CaseIterable {
    case Trivia, Math, WordScramble, TicTacToe

    func view(onExit: @escaping (Int) -> Void) -> AnyView {
        switch self {
        case .Trivia: return AnyView(TriviaView(onExit: onExit))
        case .Math: return AnyView(MathView(onExit: onExit))
        case .WordScramble: return AnyView(WordScrambleView(onExit: onExit))
        case .TicTacToe: return AnyView(TicTacToeView(onExit: onExit))
        }
    }

    static func random() -> MiniGameType { allCases.randomElement()! }
    
    static func specificNumber(opt1: Int) -> MiniGameType {
        switch opt1 {
        case 1: return .Math
        default: return allCases.randomElement()!
        }
    }
}

struct TriviaView: View {
    var onExit: (Int) -> Void  // callback with a score
    @EnvironmentObject var settings: GameSettings
    @State private var showQuitAlert = false
    @State private var alertMessage = """
    Welcome
    """
    @State private var showAlert = true
    

    var body: some View {
        NavigationStack {
            
            
            VStack {
                Spacer()
                Text("Trivia Game").font(.largeTitle).padding()
                
                Button("Go Back") { onExit(1) }.buttonStyle(.glassProminent).bold()
                
                Spacer()
                Spacer()
            }
                .withQuitButton()

            
            
            Spacer()
            if settings.showQuickEscapes {
                withQuickEscapes(onExit: onExit)
            }
            
        }
        .alert(alertMessage, isPresented: $showAlert) {
            Button("Close", role: .cancel) {
                
            }
        }
        .navigationBarBackButtonHidden(true)
    }
}

struct MathView: View {

    var onExit: (Int) -> Void  // callback with a score
    @EnvironmentObject var settings: GameSettings

    var body: some View {

        NavigationStack {

            VStack {
                Spacer()
                Text("Math Game").font(.largeTitle).padding()
                
                Button("Go Back") { onExit(1) }.buttonStyle(.glassProminent).bold()
                
                Spacer()
                Spacer()
                
            }.withQuitButton()
            
            
            
            
            Spacer()
            if settings.showQuickEscapes {
                withQuickEscapes(onExit: onExit)
            }
        }.navigationBarBackButtonHidden(true)

    }

}

struct WordScrambleView: View {

    var onExit: (Int) -> Void  // callback with a score
    @EnvironmentObject var settings: GameSettings

    var body: some View {

        NavigationStack {

            if settings.showQuickEscapes {
                withQuickEscapes(onExit: onExit)
            }
            
            VStack {
                Text("Word Game").font(.largeTitle).padding()
                Spacer()
                
                
                
                Button("Go Back") { onExit(1) }.buttonStyle(.glassProminent).bold()
                
                Spacer()
                Spacer()
            } .withQuitButton()
            
            
            
            
            Spacer()
            if settings.showQuickEscapes {
                withQuickEscapes(onExit: onExit)
            }
        }.navigationBarBackButtonHidden(true)

    }
}



struct Prompt: Identifiable, Codable {
    let id: Int
    let prompt: String
}

struct ExampleMultiPromptView: View {
    @State private var prompts: [Prompt] = [
        Prompt(id: 1, prompt: "Enter your first name"),
        Prompt(id: 2, prompt: "Enter your age"),
        Prompt(id: 3, prompt: "Enter your favorite color")
    ]
    
    @State private var currentIndex: Int = 0
    @State private var userInput: String = ""
    @State private var answers: [Int: String] = [:]
    
    var body: some View {
        VStack(spacing: 20) {
            if currentIndex < prompts.count {
                Text(prompts[currentIndex].prompt)
                    .font(.headline)
                
                TextField("Type here...", text: $userInput)
                    .textFieldStyle(RoundedBorderTextFieldStyle())
                    .padding()
                
                Button("Next") {
                    answers[prompts[currentIndex].id] = userInput
                    userInput = ""
                    currentIndex += 1
                }
                .buttonStyle(.borderedProminent)
            } else {
                Text("All prompts complete!")
                List(answers.sorted(by: { $0.key < $1.key }), id: \.key) { id, answer in
                    Text("Prompt \(id): \(answer)")
                }
            }
        }
        .padding()
    }
}

extension View {
    
    func withQuickEscapes(onExit: @escaping (Int) -> Void) -> some View {
        HStack{
            
            Button("Win") { onExit(1) }.buttonStyle(.glassProminent)
            Button("Lose") { onExit(0) }.buttonStyle(.glassProminent)
            Button("Flip a Coin") {
                if flipACoin() {
                    onExit(1)
                } else {onExit(0)}
            }.buttonStyle(.glassProminent)
        }
    }
}

func flipACoin() -> Bool {
    let flips = [0, 1]
        guard let result = flips.randomElement() else {
            print("Error: coin flip failed")
            return false
        }
        return result == 1
    
    //Or just Bool.random()
}

func cpuGameOld(gameName: String, level: Int, settings: GameSettings) -> Bool {


    if (level == 1) {
        let randomChance = [1,2,3] // 66.6% chance to lose
        let randomInt = randomChance.randomElement()!
        if (randomInt == 2 || randomInt == 1) {
            settings.sharedAlertMessage = "The CPU struggled in The " + gameName + " Game and lost!"
            return false;
        } else {
            settings.sharedAlertMessage = "The CPU played the " + gameName + " Game and sadly won."
            return true;
        }
    } else if (level == 2) {
        let randomChance = [1,2]  // 50% chance to lose
        let randomInt = randomChance.randomElement()!
        if (randomInt == 1) {
            settings.sharedAlertMessage = "The CPU played the " + gameName + " Game and lost!"
            return false;
        } else {
            settings.sharedAlertMessage = "The CPU did great the " + gameName + " Game and won."
            return true;
        }
    } else if (level == 3) {
        let randomChance = [1,2,3,4,5] // 40% chance to lose
        let randomInt = randomChance.randomElement()!
        if (randomInt == 2 || randomInt == 1) {
            settings.sharedAlertMessage = "The CPU played the " + gameName + " Game and surprisingly lost!"
            return false;
        } else {
            settings.sharedAlertMessage = "The CPU rocked the " + gameName + " Game and won."
            return true;
        }
    } else if (level == 4) {
        let randomChance = [1,2]  //30% chance to lose
        let randomInt = randomChance.randomElement()!
        if (randomInt == 1) {
            settings.sharedAlertMessage = "The CPU played the " + gameName + " Game and somehow lost!!!???"
            return false;
        } else {
            settings.sharedAlertMessage = "The CPU demolished the " + gameName + " Game and won. Of course."
            return true;
        }
    } else {
        settings.sharedAlertMessage = "Error: not a valid level/difficulty!"
        return false;
    }
}

//this is a simplified version
func cpuGame(gameName: String, level: Int, settings: GameSettings) -> Bool {
    let random = Int.random(in: 1...100)
    
    switch level {
    case 1:
        // 66% chance to lose
        if random <= 66 {
            settings.sharedAlertMessage = "The CPU struggled in the \(gameName) Game and lost!"
            return false
        } else {
            settings.sharedAlertMessage = "The CPU played the \(gameName) Game and sadly won."
            return true
        }
        
    case 2:
        // 50% chance to lose
        if random <= 50 {
            settings.sharedAlertMessage = "The CPU played the \(gameName) Game and lost!"
            return false
        } else {
            settings.sharedAlertMessage = "The CPU did great in the \(gameName) Game and won."
            return true
        }
        
    case 3:
        // 40% chance to lose
        if random <= 40 {
            settings.sharedAlertMessage = "The CPU played the \(gameName) Game and surprisingly lost!"
            return false
        } else {
            settings.sharedAlertMessage = "The CPU rocked the \(gameName) Game and won."
            return true
        }
        
    case 4:
        // 30% chance to lose
        if random <= 30 {
            settings.sharedAlertMessage = "The CPU played the \(gameName) Game and somehow lost!!!???"
            return false
        } else {
            settings.sharedAlertMessage = "The CPU demolished the \(gameName) Game and won. Of course."
            return true
        }
        
    default:
        settings.sharedAlertMessage = "Error: not a valid level/difficulty!"
        return false
    }
}

#Preview {

    let mockSettings = GameSettings()
    mockSettings.players = ["PreviewPlayer1", "PreviewPlayer2"]
    mockSettings.difficulty = 3
    mockSettings.showQuickEscapes = true

    return TriviaView(onExit: { _ in })
        .environmentObject(mockSettings)
}
