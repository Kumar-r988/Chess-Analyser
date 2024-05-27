from PyQt5 import QtCore, QtGui, QtWidgets
import sys

class ChessBoard(QtWidgets.QMainWindow):
    def __init__(self):
        super().__init__()
        self.setWindowTitle("Chess Board")
        self.setGeometry(100, 100, 950, 950)  # Adjust window size to be square
        
        self.centralwidget = QtWidgets.QWidget(self)
        self.setCentralWidget(self.centralwidget)
        
        self.grid_layout = QtWidgets.QGridLayout(self.centralwidget)
        self.grid_layout.setSpacing(0)  # No spacing between squares
        
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
        
        # Create the chessboard pattern
        for row in range(8):
            for col in range(8):
                square = QtWidgets.QLabel(self.centralwidget)
                square.setSizePolicy(QtWidgets.QSizePolicy.Expanding, QtWidgets.QSizePolicy.Expanding)
                if (row + col) % 2 == 0:
                    square.setStyleSheet("background-color: white;")
                else:
                    square.setStyleSheet("background-color: black;")
                self.grid_layout.addWidget(square, row + 1, col + 1)

        self.show()

if __name__ == "__main__":
    app = QtWidgets.QApplication(sys.argv)
    chessboard = ChessBoard()
    sys.exit(app.exec_())
