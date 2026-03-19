//
//  GameSettings.swift
//  TheMiniTinyChallenge
//
//  Created by Kenton Bell on 9/26/25.
//

import Foundation
import Combine
import SwiftUI

class GameSettings: ObservableObject {
    @Published var players: [String] = []
    @Published var currentPlayer: String = "X"
    @Published var currentPlayerOpp: String = "O"
    @Published var currentPlayerName: String = "none"
    @Published var playerCount: Int = 1
    @Published var difficulty: Int = 2
    @Published var boardSize: Int = 3
    @Published var boardArray: [[String]] = []
    @Published var gameStarted: Bool = false
    @Published var infoText: String = "None"
    
    @Published var sharedAlertMessage: String = "None"
    
    
    
    
    @Published var boardArrayInner: [[String]] = []
    
    
    //debug tools
    @Published var showQuickEscapes: Bool = true
    
    
    
    func InitializeBoard() {
        boardArray = Array(
            repeating: Array(repeating: "N", count: boardSize),
            count: boardSize
        )
    }
    
    func InitializeInnerBoard() {
        boardArrayInner = Array(
            repeating: Array(repeating: "N", count: boardSize),
            count: boardSize
        )
    }
    
    func AddMockBoardMoves() {
        boardArray[0][1] = "X"
        boardArray[1][1] = "X"
        boardArray[2][2] = "O"
    }

}
