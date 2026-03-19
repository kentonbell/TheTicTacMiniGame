import SwiftUI

struct GameView: View {
    @EnvironmentObject var settings: GameSettings
    @Environment(\.colorScheme) private var colorScheme
    @State private var currentMiniGame: MiniGameType? = nil
    @State private var totalScore = 0
    let lineWidth: CGFloat = 7

    @State private var alertMessage = ""
    @State private var showAlert = false
    @State private var gameFinished = false
    @State private var curRow = 0
    @State private var curCol = 0
    
    @State private var alertMessageThreeOptions = ""

    var body: some View {

        NavigationStack {
            
            
            
            VStack(spacing: 20) {
                Text(
                    "\(settings.currentPlayer): \(settings.currentPlayerName)'s turn"
                ).font(.title)

                Text("Mini Games Played: \(totalScore)")

                ZStack {
                    // Grid Lines
                    GeometryReader { geo in
                        let cellSize =
                            geo.size.width / CGFloat(settings.boardSize)
                        let extraLineCutoffX = CGFloat(settings.boardSize + 1)
                        let extraLineCutoffY = CGFloat(
                            settings.boardSize * 2 + 17
                        )

                        Path { path in
                            // Vertical lines
                            for i in 1..<settings.boardSize {
                                let x = CGFloat(i) * cellSize
                                path.move(
                                    to: CGPoint(x: x, y: extraLineCutoffY)
                                )
                                path.addLine(
                                    to: CGPoint(
                                        x: x,
                                        y: geo.size.height - extraLineCutoffY
                                    )
                                )
                            }

                            // Horizontal lines
                            for i in 1..<settings.boardSize {
                                var y = CGFloat(i) * cellSize * 1

                                if i < settings.boardSize / 2 {
                                    y =
                                        CGFloat(i) * cellSize
                                        * (1.07
                                            + CGFloat(
                                                Double(settings.boardSize)
                                                    * 0.02
                                            ))
                                } else if i > settings.boardSize / 2 {
                                    if i == 4 {  //slight adjust for 5x5
                                        y =
                                            CGFloat(i) * cellSize
                                            * (0.96
                                                - CGFloat(
                                                    Double(settings.boardSize)
                                                        * 0.0015
                                                ))  //slight adjust for 5x5
                                    } else {
                                        y =
                                            CGFloat(i) * cellSize
                                            * (0.97
                                                - CGFloat(
                                                    Double(settings.boardSize)
                                                        * 0.0001
                                                ))
                                    }
                                }
                                path.move(
                                    to: CGPoint(x: extraLineCutoffX, y: y)
                                )
                                path.addLine(
                                    to: CGPoint(
                                        x: geo.size.width - extraLineCutoffX,
                                        y: y
                                    )
                                )
                            }
                        }
                        .stroke(
                            colorScheme == .dark ? Color.white : Color.black,
                            style: StrokeStyle(
                                lineWidth: lineWidth,
                                lineCap: .round,
                                lineJoin: .round
                            )
                        )
                    }

                    // Cells (X’s and O’s)
                    VStack {
                        ForEach(0..<settings.boardSize, id: \.self) { row in
                            HStack {
                                ForEach(0..<settings.boardSize, id: \.self) {
                                    col in
                                    Button(action: {
                                        print("Board Tapped")

                                        if getBoardElement(row: row, col: col)
                                            == "N"
                                        {

                                            currentMiniGame =
                                                MiniGameType.random()
                                        } else {
                                            alertMessage =
                                                "That square is already taken \(settings.currentPlayerName)!"
                                            showAlert = true
                                        }

                                        curRow = row
                                        curCol = col

                                        print(
                                            "This runs BEFROE game is finished"
                                        )

                                    }) {
                                        Image(
                                            getBoardElementImage(row: row, col: col)

                                        )
                                        .resizable()
                                        .aspectRatio(contentMode: .fit)

                                        .padding(
                                            17 - CGFloat(settings.boardSize * 4)
                                        )
                                    }.buttonStyle(.glass)

                                    //.border(Color.blue, width: 10)
                                }.padding(17 - CGFloat(settings.boardSize * 3))
                            }
                        }
                    }.withQuitButton()
                }
                .aspectRatio(1, contentMode: .fit)  // Keeps board square
                //                .border(Color.black, width: lineWidth)  //for debug
                .padding()
                .background(Image("Wheat").opacity(0.7))

//                var gamesList = MiniGameType.allCases.map { "\($0)" }
                
                
//                Button(action: {currentMiniGame = MiniGameType.math}){Text("Test - get  \(String(gamesList[1])) game")
//                }.buttonStyle(.glassProminent)
                
            } //end of Vstack

            .onAppear {
                print("Game view appeared!")
                updateInfoPage()

//                DispatchQueue.main.asyncAfter(deadline: .now() + 0.01) {}
                    if checkWin() {
                        print("WINNN")
                        alertMessage = "You won \(settings.currentPlayerName)!"
                        showAlert = true
                        
                        
//                        DispatchQueue.main.asyncAfter(deadline: .now() + 1) {
                            gameFinished = true
//                        }
                        
                        
                    }
                    
                    if checkDraw() {
                        alertMessage = "It's a draw!"
                        showAlert = true
                        DispatchQueue.main.asyncAfter(deadline: .now() + 1) {
                            gameFinished = true
                        }
                        
                    }
                

            }.alert(alertMessage, isPresented: $showAlert) {
                Button("Close", role: .cancel) {
                    if gameFinished {
                        settings.gameStarted = false
                    }
                }
            }
            .padding()
            //.navigationBarBackButtonHidden(true)

            // Navigation happens here
            .navigationDestination(item: $currentMiniGame) { miniGame in
                miniGame.view { score in
                    currentMiniGame = nil  // reset Minigame

                    print("This runs after game is finished")

                    totalScore += score
                    //Using mod to have points
                    if score % 2 == 1 {  //For Win

                        //For Win
                        setBoardElementForCurrentPlayer(
                            row: curRow,
                            col: curCol,
                            XON: settings.currentPlayer
                        )
                    } else if score % 2 == 0 {
                        //For loss
                        setBoardElementForCurrentPlayer(
                            row: curRow,
                            col: curCol,
                            XON: settings.currentPlayerOpp
                        )
                    } else {
                        print("we have a magical other score")
                    }
                    
                    
                    if checkWin() {
                        print("WINNN")
                        alertMessage = "You won \(settings.currentPlayerName)!"
                        showAlert = true
                        
                        
//                        DispatchQueue.main.asyncAfter(deadline: .now() + 1) {
                            gameFinished = true
//                        }
                        
                        
                    }
                    
                    if checkDraw() {
                        alertMessage = "It's a draw!"
                        showAlert = true
                        DispatchQueue.main.asyncAfter(deadline: .now() + 1) {
                            gameFinished = true
                        }
                        
                    }
                    
                    
                    //ternaries
                    settings.currentPlayer =
                        (settings.currentPlayer == "X")
                        ? "O" : "X"
                    //ternary for opp
                    settings.currentPlayerOpp =
                        (settings.currentPlayerOpp == "X")
                        ? "O" : "X"
                    //ternary for switching players
                    settings.currentPlayerName =
                        (settings.currentPlayerName
                            == settings.players[0])
                        ? settings.players[1]
                        : settings.players[0]

                    
                    
                }
            }

        }
    }

    func getBoardElementImage(row: Int, col: Int) -> String {
        var myXON = settings.boardArray[row][col]
        if colorScheme == .dark  && myXON != "N" {
            myXON += "Dark"
        }
        guard row < settings.boardArray.count,
            col < settings.boardArray[row].count
        else { return "N" }
        return myXON
    }

    func getBoardElement(row: Int, col: Int) -> String {
        guard row < settings.boardArray.count,
            col < settings.boardArray[row].count
        else { return "N" }
        return settings.boardArray[row][col]

    }

    func setBoardElementForCurrentPlayer(row: Int, col: Int, XON: String) {
        guard row < settings.boardArray.count,
            col < settings.boardArray[row].count
        else { return }

        if settings.boardArray[row][col] != "N" {
            print("This square is already taken!")
            return
        }

//        var myXON = XON

        settings.boardArray[row][col] = XON

    }
    
    func get3RandomGamesToChoose(){
        
    }

    func updateFrontGamePage() -> String {

        var result = ""
        result += "Stats:\n\n"
        result += "Difficulty: \(settings.difficulty)\n"
        if settings.playerCount == 1 {
            result += "Players: \(settings.players[0])"
        } else {
            result += "Players: \(settings.players.joined(separator: " and "))"
        }
        result +=
            "\nCurrent Player: \(settings.currentPlayer) or \(settings.currentPlayerName) \n"

        return result

    }

    func updateInfoPage() {

        var result = ""
        result += "Stats:\n\n"
        result += "Difficulty: \(settings.difficulty)\n"
        if settings.playerCount == 1 {
            result += "Players: \(settings.players[0])"
        } else {
            result += "Players: \(settings.players.joined(separator: " and "))"
        }
        result +=
            "\nCurrent Player: \(settings.currentPlayer) or \(settings.currentPlayerName) \n"

        settings.infoText = result

    }

    func checkWin() -> Bool {
        let n = settings.boardSize
        let board = settings.boardArray
        let player = settings.currentPlayer
        
        // Check rows
        for i in 0..<n {
            var win = true
            for j in 0..<n {
                if board[i][j] != player {
                    win = false
                    break
                }
            }
            if win { return true }
        }
        
        // Check columns
        for j in 0..<n {
            var win = true
            for i in 0..<n {
                if board[i][j] != player {
                    win = false
                    break
                }
            }
            if win { return true }
        }
        
        // Check main diagonal
        var win = true
        for i in 0..<n {
            if board[i][i] != player {
                win = false
                break
            }
        }
        if win { return true }
        
        // Check anti-diagonal
        win = true
        for i in 0..<n {
            if board[i][n - 1 - i] != player {
                win = false
                break
            }
        }
        if win { return true }
        
        return false
    }
    
    func checkOldWin() -> Bool{
        // Check rows and columns
        for i in 0..<settings.boardSize {
            if (settings.boardArray[i][0] == settings.currentPlayer
                && settings.boardArray[i][1] == settings.currentPlayer
                && settings.boardArray[i][2] == settings.currentPlayer
                && settings.boardArray[i][settings.boardSize - 1]
                    == settings.currentPlayer
                && settings.boardArray[i][settings.boardSize - 2]
                    == settings.currentPlayer)
                || (settings.boardArray[0][i] == settings.currentPlayer
                    && settings.boardArray[1][i] == settings.currentPlayer
                    && settings.boardArray[2][i] == settings.currentPlayer
                    && settings.boardArray[settings.boardSize - 1][i]
                        == settings.currentPlayer
                    && settings.boardArray[settings.boardSize - 2][i]
                        == settings.currentPlayer)
            {
                return true
            }
        }

        // Check diagonals
        if (settings.boardArray[0][0] == settings.currentPlayer
            && settings.boardArray[1][1] == settings.currentPlayer
            && settings.boardArray[2][2] == settings.currentPlayer
            && settings.boardArray[settings.boardSize - 1][
                settings.boardSize - 1
            ] == settings.currentPlayer
            && settings.boardArray[settings.boardSize - 2][
                settings.boardSize - 2
            ] == settings.currentPlayer)
            || (settings.boardArray[0][settings.boardSize - 1]
                == settings.currentPlayer
                && settings.boardArray[1][settings.boardSize - 2]
                    == settings.currentPlayer
                && settings.boardArray[settings.boardSize - 1][0]
                    == settings.currentPlayer
                && settings.boardArray[2][settings.boardSize - 3]
                    == settings.currentPlayer
                && settings.boardArray[settings.boardSize - 2][1]
                    == settings.currentPlayer)
        {
            return true
        }

        return false
    }

    func checkDraw() -> Bool {
        for i in 0..<settings.boardSize {
            for j in 0..<settings.boardSize {
                if settings.boardArray[i][j] == "N" {
                    return false  // Found an empty space
                }
            }
        }
        return true  // No empty spaces left
    }

}

extension View {  //call with .withQuitButton()
    func withQuitButton() -> some View {
        self.toolbar {

            ToolbarItem(placement: .navigationBarLeading) {
                QuitButton()

            }
            ToolbarItem(placement: .navigationBarLeading) {
                InfoButton()

            }
        }
    }
}

struct InfoButton: View {
    @State private var showInfoAlert = false
    @EnvironmentObject var settings: GameSettings

    var body: some View {
        Button {
            showInfoAlert = true
        } label: {
            Image(systemName: "info.circle")
        }
        .alert(settings.infoText, isPresented: $showInfoAlert) {
            Button("Close", role: .cancel) {}
        }
    }
}

struct QuitButton: View {
    @EnvironmentObject var settings: GameSettings
    @State private var showQuitAlert = false

    var body: some View {
        Button {
            showQuitAlert = true
        } label: {
            Image(systemName: "house.fill")
        }.alert("Are you sure?", isPresented: $showQuitAlert) {

            Button("Quit Game", role: .destructive) {
                settings.gameStarted = false
            }
            Button("Cancel", role: .cancel) {}
        }

    }
}

#Preview {
    let mockSettings = GameSettings()
    mockSettings.players = ["Alice", "Bob"]
    mockSettings.currentPlayerName = "Alice"
    mockSettings.difficulty = 3
    mockSettings.playerCount = 1
    mockSettings.boardSize = 3

    mockSettings.InitializeBoard()
    mockSettings.AddMockBoardMoves()

    return GameView()
        .environmentObject(mockSettings)
}
