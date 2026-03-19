import SwiftUI

struct TicTacToeView: View {
    @EnvironmentObject var settings: GameSettings
    @Environment(\.colorScheme) private var colorScheme
    @State private var currentMiniGame: MiniGameType? = nil
    @State private var totalScore = 0
    let lineWidth: CGFloat = 7

    @State private var alertMessage = ""
    @State private var showAlert = false
    
    @State private var curRow = 0
    @State private var curCol = 0
    
    @State private var currentPlayer: String = "X"
    @State private var currentPlayerOpp: String = "O"
    @State private var currentPlayerName: String = "none"
    
    @State private var initialPlayerName: String = "none"
    
    @State private var alertMessageThreeOptions = ""

    
    var onExit: (Int) -> Void  // callback with a score
    
    @State private var showQuitAlert = false
    
    var body: some View {

        NavigationStack {
            
            
            
            VStack(spacing: 20) {
                Text(
                    "\(currentPlayer): \(currentPlayerName)'s turn"
                ).font(.title)

                Text("Moves made: \(totalScore)")

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

                                        if getBoardElement(row: row, col: col)
                                            == "N"
                                        {

//                                            currentMiniGame = MiniGameType.random()
                                            
                                            totalScore += 1
                                            //Using mod to have points
                                            
                                            
                                            curRow = row
                                            curCol = col

                                                //For Win
                                                setBoardElementForCurrentPlayer(
                                                    row: curRow,
                                                    col: curCol,
                                                    XON: currentPlayer
                                                )
                                            
                                            
                                            
                                            if checkWin() {
                                                print("WINNN")
                                                alertMessage = "You won \(currentPlayerName)!"
                                                showAlert = true
                                                
                                                
                                                DispatchQueue.main.asyncAfter(deadline: .now() + 2) {
                                                    if currentPlayerName == initialPlayerName {
                                                        ResetInnerBoard(settings: settings)
                                                        onExit(0)
                                                    } else {
                                                        ResetInnerBoard(settings: settings)
                                                        onExit(1)
                                                    }
                                                }
                                                
                                                
                                            } else {
                                                
                                                if checkDraw() {
                                                    alertMessage = "It's a draw!"
                                                    showAlert = true
                                                    ResetInnerBoard(settings: settings)
                                                    onExit(0)
                                                    
                                                }
                                            }
                                            
                                            
                                            //ternaries
                                            currentPlayer =
                                                (currentPlayer == "X")
                                                ? "O" : "X"
                                            //ternary for opp
                                            currentPlayerOpp =
                                                (currentPlayerOpp == "X")
                                                ? "O" : "X"
                                            //ternary for switching players
                                            currentPlayerName =
                                                (currentPlayerName
                                                    == settings.players[0])
                                                ? settings.players[1]
                                                : settings.players[0]

                                            
                                            
                                            
                                        } else {
                                            alertMessage =
                                                "That square is already taken \(currentPlayerName)!"
                                            showAlert = true
                                        }


                                        

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
                .background(Image("Wheat").opacity(0.05))

//                var gamesList = MiniGameType.allCases.map { "\($0)" }
                
                
//                Button(action: {currentMiniGame = MiniGameType.math}){Text("Test - get  \(String(gamesList[1])) game")
//                }.buttonStyle(.glassProminent)
                
//                if settings.showQuickEscapes {
//                    withQuickEscapes(onExit: onExit)
//                }
                
            } //end of Vstack

            .onAppear {
                print("TacTacToe appreared!")
                
                currentPlayer = settings.currentPlayer
                currentPlayerOpp = settings.currentPlayerOpp
                currentPlayerName = settings.currentPlayerName
                initialPlayerName = settings.currentPlayer
                
                updateInfoPage()

//                DispatchQueue.main.asyncAfter(deadline: .now() + 0.01) {}
                    if checkWin() {
                        print("WINNN")
                        alertMessage = "You won \(currentPlayerName)!"
                        showAlert = true
                        onExit(1)
                        
                        
//                        DispatchQueue.main.asyncAfter(deadline: .now() + 1) {
//                            gameFinished = true
//                        }
                        
                        
                    }
                    
                    if checkDraw() {
                        alertMessage = "It's a draw!"
                        showAlert = true
                        onExit(0)
                        
                    }
                

            }.alert(alertMessage, isPresented: $showAlert) {
                Button("Close", role: .cancel) {
                  
                }
            }
            .padding()
            //.navigationBarBackButtonHidden(true)

            // Navigation happens here
            .navigationDestination(item: $currentMiniGame) { miniGame in
                miniGame.view { score in
                    currentMiniGame = nil  // reset Minigame

                    
                    
                    
                    
                }
            }

        }
    }

    func getBoardElementImage(row: Int, col: Int) -> String {
        var myXON = settings.boardArrayInner[row][col]
        if colorScheme == .dark  && myXON != "N" {
            myXON += "Dark"
        }
        guard row < settings.boardArrayInner.count,
            col < settings.boardArrayInner[row].count
        else { return "N" }
        return myXON
    }

    func getBoardElement(row: Int, col: Int) -> String {
        guard row < settings.boardArrayInner.count,
            col < settings.boardArrayInner[row].count
        else { return "N" }
        return settings.boardArrayInner[row][col]

    }

    func setBoardElementForCurrentPlayer(row: Int, col: Int, XON: String) {
        guard row < settings.boardArrayInner.count,
            col < settings.boardArrayInner[row].count
        else { return }

        if settings.boardArrayInner[row][col] != "N" {
            print("This square is already taken!")
            return
        }

//        var myXON = XON

        settings.boardArrayInner[row][col] = XON

    }
    
    func ResetInnerBoard(settings: GameSettings) {
        settings.boardArrayInner = Array(
            repeating: Array(repeating: "N", count: settings.boardSize),
            count: settings.boardSize
        )
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
            "\nCurrent Player: \(currentPlayer) or \(currentPlayerName) \n"

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
            "\nCurrent Player: \(currentPlayer) or \(currentPlayerName) \n"

        settings.infoText = result

    }

  
    
    func checkWin() -> Bool {
        let n = settings.boardSize
        let board = settings.boardArrayInner
        let player = currentPlayer
        
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

    func checkDraw() -> Bool {
        for i in 0..<settings.boardSize {
            for j in 0..<settings.boardSize {
                if settings.boardArrayInner[i][j] == "N" {
                    return false  // Found an empty space
                }
            }
        }
        return true  // No empty spaces left
    }
    
    

}


//#Preview {
//    let mockSettings = GameSettings()
//    mockSettings.players = ["Alice", "Bob"]
//    mockSettings.currentPlayerName = "Alice"
//    mockSettings.difficulty = 3
//    mockSettings.playerCount = 1
//    mockSettings.boardSize = 3
//
//    mockSettings.InitializeBoard()
//    mockSettings.AddMockBoardMoves()
//
//    return TicTacToeView()
//        .environmentObject(mockSettings)
//}

