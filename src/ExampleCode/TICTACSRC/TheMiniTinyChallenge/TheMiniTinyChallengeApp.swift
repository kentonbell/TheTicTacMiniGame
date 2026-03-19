//
//  TheMiniTinyChallengeApp.swift
//  TheMiniTinyChallenge
//
//  Created by Kenton Bell on 9/25/25.
//

import SwiftUI

@main
struct TheMiniTinyChallengeApp: App {
    
    
    
    @StateObject private var settings = GameSettings()
    
    var body: some Scene {
        WindowGroup {
            ZStack {
                if settings.gameStarted {
                    GameView().withQuitButton()
                        .environmentObject(settings)
                        .transition(.opacity) // fade in/out
                } else {
                    WelcomeView()
                        .environmentObject(settings)
                        .transition(.opacity) // fade in/out
                }
            }
            
            .animation(.easeInOut(duration: 0.5), value: settings.gameStarted)
        }
        }
}


//#Preview {
//   TheMiniTinyChallengeApp()
//}
