//
//  WelcomeView.swift
//  TheMiniTinyChallenge
//
//  Created by Kenton Bell on 9/26/25.
//

import SwiftUI



struct WelcomeView: View {
    @EnvironmentObject var settings: GameSettings
    @AppStorage("player1") private var player1name: String = ""
    @AppStorage("player2") private var player2name: String = ""
    
    @State private var showSettings = false
    
    @State private var nameInput1: String = ""
    @State private var nameInput2: String = ""
    @State private var difficultySelection: Int = 2
    @State private var playerCountSelection: Int = 1
    @State private var boardSizeTemp: Int = 3
    
    private var paddingAmount: CGFloat = 20
    
    var body: some View {
        
        NavigationStack{
            
            VStack(spacing: 15) {
                Text("The \nMini \nTiny \nChallenge").font(.largeTitle)//.padding(paddingAmount)
                
                
//                Text ("How many players?")
                
                Picker("Number of players", selection: $playerCountSelection) {
                    Text("One Player").tag(1)
                    Text("Two Players").tag(2)
                }.pickerStyle(SegmentedPickerStyle())
                
                
                VStack{
                    TextField("Enter player one name", text: $nameInput1)
                        .textFieldStyle(RoundedBorderTextFieldStyle())
                        .padding(paddingAmount)
                    
                    if (playerCountSelection == 2) {
                        
                        
                        TextField("Enter player two name", text: $nameInput2)
                            .textFieldStyle(RoundedBorderTextFieldStyle())
                            .padding(paddingAmount)
                            .transition(.move(edge: .top).combined(with: .opacity)) // slide + fade
                    } else {
                        //                    print("more players for later!")
                    }
                    
                }.animation(.easeInOut(duration: 0.4), value: playerCountSelection)
                
                
                
                
                
                
                Picker("Difficulty", selection: $difficultySelection) {
                    Text("Easy").tag(1)
                    Text("Normal").tag(2)
                    Text("Hard").tag(3)
                    Text("Implausible").tag(4)
                }
                .pickerStyle(PalettePickerStyle())
                
                Text("Board Size")
                Picker("Board Size", selection: $boardSizeTemp) {
            
                    Text("3x3").tag(3)
                    Text("4x4").tag(4)
                    Text("5x5").tag(5)
                }
                .pickerStyle(PalettePickerStyle())
                
                
                Text("")

                NavigationLink(destination: GameView()
                    .navigationBarBackButtonHidden(false) // Hide back button
                ) {
                    Text("Start Game")
                        .bold()
                        .frame(maxWidth: .infinity)
                        .padding()
                        .background(Color.mint)
                        .foregroundColor(.white)
                        .cornerRadius(80)
                        
                    
                    
                    
                }.simultaneousGesture(TapGesture().onEnded{
                    
                    
                    settings.players = [nameInput1, nameInput2]
                    settings.playerCount = playerCountSelection
                    settings.difficulty = difficultySelection
                    settings.gameStarted = true
                    
                    settings.currentPlayer = "X"
                    settings.currentPlayerName = nameInput1
                    
                    settings.boardSize = boardSizeTemp
                    
                    // save names for next launch
                    player1name = nameInput1
                    player2name = nameInput2
                    
                    settings.InitializeBoard()
                    settings.InitializeInnerBoard()
                })
                
                Spacer()
            }
            
            
            .padding()
//            .navigationTitle("Welcome")
            .toolbar {
                // Top-right Settings button
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button {
                        showSettings = true
                    } label: {
                        Image(systemName: "gearshape.fill")
                    }
                }
            }
            // Present settings as a sheet or navigation link
            .navigationDestination(isPresented: $showSettings) {
                SettingsView()
            }
            
            .onAppear {
                print("Welcome view appeared!")
                
                if !player1name.isEmpty {
                    nameInput1 = player1name
                    
                }
                if !player2name.isEmpty {
                    nameInput2 = player2name
                }
            }
            .padding(paddingAmount)
            .background(Image("Wheat").opacity(0.3))
            //        .padding(paddingAmount)
        }
    }
}



#Preview {
   WelcomeView()
}
