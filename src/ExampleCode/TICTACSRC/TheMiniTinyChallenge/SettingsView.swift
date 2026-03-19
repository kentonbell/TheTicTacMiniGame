//
//  SettingsView.swift
//  TheMiniTinyChallenge
//
//  Created by Kenton Bell on 9/26/25.
//

import SwiftUI

struct SettingsView: View {
    @Environment(\.dismiss) var dismiss
    
    var body: some View {
        VStack(spacing: 20) {
            Text("Settings").font(.largeTitle)
            
            // Your settings controls go here
            
            Button("Back") {
                dismiss() // Go back to WelcomeView
            }
            .buttonStyle(.borderedProminent)
        }
        .padding()
        .navigationBarBackButtonHidden(false) // Hide default nav back button
    }
}
