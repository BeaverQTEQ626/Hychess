const boardEl = document.getElementById("board");
const statusEl = document.getElementById("status");

const game = new Chess();

let selectedSquare = null;

function createBoard() {
    boardEl.innerHTML = "";

    const board = game.board();

    for (let row = 7; row >= 0; row--) {
        for (let col = 0; col < 8; col++) {
            const squareColor = (row + col) % 2 === 0 ? "light" : "dark";
            const squareName = "abcdefgh"[col] + (row + 1);

            const square = document.createElement("div");
            square.className = `square ${squareColor}`;
            square.dataset.square = squareName;

            const piece = board[row][col];
            if (piece) {
                const img = document.createElement("img");
                img.src = `pieces/${piece.color}${piece.type}.png`;
                img.draggable = true;

                img.addEventListener("dragstart", () => {
                    selectedSquare = squareName;
                    highlightMoves(squareName);
                });

                square.appendChild(img);
            }

            square.addEventListener("dragover", e => e.preventDefault());
            square.addEventListener("drop", () => {
                if (selectedSquare) {
                    makeMove(selectedSquare, squareName);
                    selectedSquare = null;
                }
            });

            boardEl.appendChild(square);
        }
    }

    updateStatus();
}

function makeMove(from, to) {
    const move = game.move({
        from,
        to,
        promotion: "q"
    });

    clearHighlights();

    if (move) {
        createBoard();
    }
}

function highlightMoves(square) {
    clearHighlights();
    const moves = game.moves({ square, verbose: true });

    moves.forEach(move => {
        const target = document.querySelector(
            `.square[data-square='${move.to}']`
        );
        if (target) target.classList.add("highlight");
    });
}

function clearHighlights() {
    document.querySelectorAll(".square").forEach(sq => {
        sq.classList.remove("highlight");
    });
}

function updateStatus() {
    let text = "";

    if (game.isCheckmate()) {
        text = "♚ Checkmate!";
    } else if (game.isDraw()) {
        text = "⚖ Hòa!";
    } else {
        text = `Lượt: ${game.turn() === "w" ? "Trắng" : "Đen"}`;
        if (game.isCheck()) {
            text += " — CHECK!";
        }
    }

    statusEl.textContent = text;
}

createBoard();
