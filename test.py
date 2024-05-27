from PyQt5 import QtCore, QtGui, QtWidgets
import sys,os

class ChessBoard(QtWidgets.QMainWindow):
    def __init__(self):
        super().__init__()
        self.setWindowTitle("Chess Board")
        self.setGeometry(100, 100, 900, 900)  # Adjust window size to be 900x900
        
        self.centralwidget = QtWidgets.QWidget(self)
        self.setCentralWidget(self.centralwidget)
        
        self.grid_layout = QtWidgets.QGridLayout(self.centralwidget)
        self.grid_layout.setSpacing(0)  # No spacing between squares
        
        self.selected_piece = None
        self.selected_piece_position = None
        
        files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
        ranks = ['8', '7', '6', '5', '4', '3', '2', '1']
        
        bold_font = QtGui.QFont()
        bold_font.setBold(True)
        
        # Add file labels at the bottom
        for col in range(8):
            label = QtWidgets.QLabel(files[col])
            label.setAlignment(QtCore.Qt.AlignCenter)
            label.setFont(bold_font)
            self.grid_layout.addWidget(label, 9, col + 1)
        
        # Add rank labels on the left
        for row in range(8):
            label = QtWidgets.QLabel(ranks[row])
            label.setAlignment(QtCore.Qt.AlignCenter)
            label.setFont(bold_font)
            self.grid_layout.addWidget(label, row + 1, 0)
        
        # Create the chessboard pattern and place pieces
        self.squares = {}
        for row in range(8):
            for col in range(8):
                square = Square(self, row, col)
                if (row + col) % 2 == 0:
                    square.setStyleSheet("background-color: white;")
                else:
                    square.setStyleSheet("background-color: black;")
                self.grid_layout.addWidget(square, row + 1, col + 1)
                self.squares[(row, col)] = square

        self.add_pieces()

        self.show()
    
    def add_pieces(self):
        # Path to the directory containing the piece images
        path = r"C:\Users\kumar\OneDrive\Desktop\Git_repo\Chess Analyser\pieces"
        piece_images = {
            'white_king'  : 'king-w.svg',
            'white_queen' : 'queen-w.svg',
            'white_rook'  : 'rook-w.svg',
            'white_bishop': 'bishop-w.svg',
            'white_knight': 'knight-w.svg',
            'white_pawn'  : 'pawn-w.svg',
            'black_king'  : 'king-b.svg',
            'black_queen' : 'queen-b.svg',
            'black_rook'  : 'rook-b.svg',
            'black_bishop': 'bishop-b.svg',
            'black_knight': 'knight-b.svg',
            'black_pawn'  : 'pawn-b.svg',
        }

        # Place initial pieces on the board
        piece_positions = {
            'white': {
                'king': (7, 4),
                'queen': (7, 3),
                'rooks': [(7, 0), (7, 7)],
                'bishops': [(7, 2), (7, 5)],
                'knights': [(7, 1), (7, 6)],
                'pawns': [(6, col) for col in range(8)]
            },
            'black': {
                'king': (0, 4),
                'queen': (0, 3),
                'rooks': [(0, 0), (0, 7)],
                'bishops': [(0, 2), (0, 5)],
                'knights': [(0, 1), (0, 6)],
                'pawns': [(1, col) for col in range(8)]
            }
        }

        for color, positions in piece_positions.items():
            for piece, pos in positions.items():
                if piece in ['rooks', 'bishops', 'knights', 'pawns']:
                    for position in pos:
                        self.set_piece(color, piece[:-1], position, path, piece_images)
                else:
                    self.set_piece(color, piece, pos, path, piece_images)

    def set_piece(self, color, piece, position, path, piece_images):
        piece_label = QtWidgets.QLabel(self.centralwidget)
        piece_pixmap = QtGui.QPixmap(os.path.join(path, f'{color}_{piece_images[f"{color}_{piece}"]}'))
        piece_label.setPixmap(piece_pixmap.scaled(100, 100, QtCore.Qt.KeepAspectRatio))
        piece_label.setAlignment(QtCore.Qt.AlignCenter)
        piece_label.setSizePolicy(QtWidgets.QSizePolicy.Expanding, QtWidgets.QSizePolicy.Expanding)
        piece_label.setObjectName(f'{color}_{piece}')
        self.grid_layout.addWidget(piece_label, position[0] + 1, position[1] + 1)
        self.squares[position].piece = piece_label

    def square_clicked(self, row, col):
        if self.selected_piece:
            self.move_piece(self.selected_piece_position, (row, col))
            self.selected_piece.setStyleSheet("")
            self.selected_piece = None
            self.selected_piece_position = None
        elif self.squares[(row, col)].piece:
            self.selected_piece = self.squares[(row, col)].piece
            self.selected_piece.setStyleSheet("border: 2px solid red;")
            self.selected_piece_position = (row, col)
    
    def move_piece(self, from_pos, to_pos):
        if self.squares[to_pos].piece:
            self.squares[to_pos].piece.setParent(None)  # Remove the piece at the destination
        
        piece = self.squares[from_pos].piece
        self.squares[from_pos].piece = None
        self.grid_layout.addWidget(piece, to_pos[0] + 1, to_pos[1] + 1)
        self.squares[to_pos].piece = piece


class Square(QtWidgets.QLabel):
    def __init__(self, parent, row, col):
        super().__init__(parent.centralwidget)
        self.parent = parent
        self.row = row
        self.col = col
        self.piece = None
        self.setSizePolicy(QtWidgets.QSizePolicy.Expanding, QtWidgets.QSizePolicy.Expanding)
        self.setAlignment(QtCore.Qt.AlignCenter)

    def mousePressEvent(self, event):
        self.parent.square_clicked(self.row, self.col)


if __name__ == "__main__":
    app = QtWidgets.QApplication(sys.argv)
    chessboard = ChessBoard()
    sys.exit(app.exec_())
