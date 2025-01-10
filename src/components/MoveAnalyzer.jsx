import React, { useState, useEffect } from "react";
import axios from "axios";
import { Chess } from "chess.js";
import EvaluationBar from "./EvaluationBar";

const STOCKFISH_API_URL = "https://stockfish.online/api/s/v2.php";

// Helper function to convert moves into FEN using chess.js
const generateFenFromMoves = (moves) => {
  const chess = new Chess();
  moves.forEach((move) => {
    chess.move(move);
  });
  console.log(chess.fen());
  return chess.fen();
};

const MoveAnalyzer = ({ moves: combinedMoves }) => {
  const [moves, setMoves] = useState(""); // Local state for moves
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Autofill moves when combinedMoves prop changes
    setMoves(combinedMoves);
  }, [combinedMoves]);

  const handleAnalyze = async () => {
    setLoading(true);
    setError(null);

    const movesArray = moves.trim().split(" ");
    const fen = generateFenFromMoves(movesArray);

    try {
      const depth = 10;
      const result = await axios.get(STOCKFISH_API_URL, {
        params: { fen, depth },
      });

      if (result.data.success) {
        setResponse(result.data);
      } else {
        setError("API Error: " + (result.data.data || "Unknown error"));
      }
    } catch (err) {
      setError("Request failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "1rem", maxWidth: "600px", margin: "auto" }}>
      <h1>Chess Move Analyzer</h1>
      <textarea
        rows="4"
        placeholder="Enter moves separated by spaces (e.g., e2e4 e7e5)..."
        value={moves}
        onChange={(e) => setMoves(e.target.value)}
        style={{ width: "100%", padding: "0.5rem", fontSize: "1rem" }}
      />
      <button
        onClick={handleAnalyze}
        style={{
          marginTop: "1rem",
          padding: "0.5rem 1rem",
          fontSize: "1rem",
          cursor: "pointer",
        }}
        disabled={loading}
      >
        {loading ? "Analyzing..." : "Analyze Moves"}
      </button>

      {error && (
        <p style={{ color: "red", marginTop: "1rem" }}>
          <strong>Error:</strong> {error}
        </p>
      )}

      {response && (
        <div style={{ marginTop: "1rem", padding: "1rem", border: "1px solid #ddd" }}>
          <h3>Analysis Results</h3>
          <p>
            <strong>Best Move:</strong> {response.bestmove}
          </p>
          <EvaluationBar evaluation={response.evaluation} />
          <p>
            <strong>Mate:</strong> {response.mate || "None"}
          </p>
          <p>
            <strong>Continuation:</strong> {response.continuation}
          </p>
        </div>
      )}
    </div>
  );
};

export default MoveAnalyzer;
