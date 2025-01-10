// src/components/EvaluationBar.jsx
import React from "react";

const EvaluationBar = ({ evaluation }) => {
  // Calculate the percentage for the evaluation (assuming it's between -1 and 1)
  const evaluationPercentage = Math.min(Math.max(evaluation, -1.5), 1.5); // Clamp value between -1 and 1

  // Determine who has the advantage based on the evaluation range
  let advantageMessage = "";
  let barColor = evaluationPercentage > 0 ? "green" : "red"; // Default to green for white, red for black

  if (evaluation > 0 && evaluation <= 1) {
    advantageMessage = "White has a slight advantage";
  } else if (evaluation > 1 && evaluation <= 1.5) {
    advantageMessage = "White has a moderate advantage";
  } else if (evaluation > 1.5) {
    advantageMessage = "White has a decisive advantage";
  } else if (evaluation >= -1 && evaluation < 0) {
    advantageMessage = "Black has a slight advantage";
    barColor = "red";
  } else if (evaluation < -1 && evaluation >= -1.5) {
    advantageMessage = "Black has a moderate advantage";
    barColor = "darkred";
  } 
  else if (evaluation < -1.5){
    advantageMessage = "Black has a decisive advantage";
    barColor = "darkred";
  } else {
    advantageMessage = "No clear advantage";
  }

  return (
    <div style={{ marginTop: "1rem" }}>
      <p><strong>Evaluation:</strong> {evaluation}</p>
      <div
        style={{
          width: "100%",
          height: "20px",
          backgroundColor: "#ddd",
          borderRadius: "10px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${(evaluationPercentage + 1) * 50}%`, // Scale the value to 0-100%
            backgroundColor: barColor,
            transition: "width 0.3s ease-in-out",
          }}
        ></div>
      </div>
      <p style={{ marginTop: "0.5rem", fontWeight: "bold", color: barColor }}>
        {advantageMessage}
      </p>
    </div>
  );
};

export default EvaluationBar;
