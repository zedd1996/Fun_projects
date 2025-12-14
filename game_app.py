"""Command-line Tic Tac Toe game.

Play against a simple computer opponent with a few strategic moves.
"""
from __future__ import annotations

import random
from typing import List

PLAYER_MARK = "X"
COMPUTER_MARK = "O"
EMPTY = " "
WINNING_LINES = [
    (0, 1, 2),
    (3, 4, 5),
    (6, 7, 8),
    (0, 3, 6),
    (1, 4, 7),
    (2, 5, 8),
    (0, 4, 8),
    (2, 4, 6),
]


def create_board() -> List[str]:
    return [EMPTY] * 9


def print_board(board: List[str]) -> None:
    print("\nCurrent board:")
    for row in range(0, 9, 3):
        segment = []
        for offset in range(3):
            idx = row + offset
            segment.append(board[idx] if board[idx] != EMPTY else str(idx + 1))
        print(f" {segment[0]} | {segment[1]} | {segment[2]}")
        if row < 6:
            print("---+---+---")
    print()


def check_winner(board: List[str], mark: str) -> bool:
    return any(all(board[pos] == mark for pos in line) for line in WINNING_LINES)


def board_full(board: List[str]) -> bool:
    return all(square != EMPTY for square in board)


def available_moves(board: List[str]) -> List[int]:
    return [idx for idx, square in enumerate(board) if square == EMPTY]


def try_complete_line(board: List[str], mark: str) -> int | None:
    for line in WINNING_LINES:
        marks = [board[pos] for pos in line]
        if marks.count(mark) == 2 and marks.count(EMPTY) == 1:
            return line[marks.index(EMPTY)]
    return None


def computer_move(board: List[str]) -> int:
    winning_move = try_complete_line(board, COMPUTER_MARK)
    if winning_move is not None:
        return winning_move

    blocking_move = try_complete_line(board, PLAYER_MARK)
    if blocking_move is not None:
        return blocking_move

    if board[4] == EMPTY:
        return 4

    corners = [pos for pos in (0, 2, 6, 8) if board[pos] == EMPTY]
    if corners:
        return random.choice(corners)

    return random.choice(available_moves(board))


def prompt_player_move(board: List[str]) -> int:
    valid_moves = {str(i + 1): i for i in available_moves(board)}
    while True:
        user_input = input("Choose a square (1-9): ").strip()
        if user_input in valid_moves:
            return valid_moves[user_input]
        print("Invalid choice. Pick an empty square using numbers 1-9.")


def apply_move(board: List[str], position: int, mark: str) -> None:
    board[position] = mark


def play_round() -> None:
    board = create_board()
    print("\nNew game! You are X and go first.")

    while True:
        print_board(board)
        player_move = prompt_player_move(board)
        apply_move(board, player_move, PLAYER_MARK)

        if check_winner(board, PLAYER_MARK):
            print_board(board)
            print("You win! \N{party popper}\n")
            return
        if board_full(board):
            print_board(board)
            print("It's a draw. \N{thinking face}\n")
            return

        comp_move = computer_move(board)
        apply_move(board, comp_move, COMPUTER_MARK)
        print(f"Computer chooses square {comp_move + 1}.")

        if check_winner(board, COMPUTER_MARK):
            print_board(board)
            print("Computer wins! Better luck next time.\n")
            return
        if board_full(board):
            print_board(board)
            print("It's a draw. \N{thinking face}\n")
            return


def main() -> None:
    print("Welcome to Tic Tac Toe! Fill a row, column, or diagonal to win.")
    while True:
        play_round()
        again = input("Play again? (y/n): ").strip().lower()
        if again not in {"y", "yes"}:
            print("Thanks for playing!")
            break


if __name__ == "__main__":
    main()
