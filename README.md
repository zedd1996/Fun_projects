# Fun Projects

## Tic Tac Toe Console Game

This repository now includes a command-line Tic Tac Toe game. Play against a computer that blocks winning lines and looks for quick victories.

### How to Play
1. Ensure you have Python 3.10+ installed.
2. Run the game:
   ```bash
   python game_app.py
   ```
3. Enter numbers 1-9 to choose a square. The layout matches the board from left to right, top to bottom.
4. After each round, choose whether to play again.

### Game Notes
- You play as **X** and always take the first turn.
- The computer uses a light strategy: win if possible, block your line, take the center, then grab a corner.
