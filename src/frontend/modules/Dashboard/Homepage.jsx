import React from "react";
import { Card, CardHeader, CardFooter } from "@fluentui/react-components";
import { Button, Text } from "@fluentui/react-components";
import "./Homepage.css";

const Homepage = () => {
  // Dummy data for recently opened files
  const recentFiles = [
    "Project1.dl",
    "ModelBasicNN.py",
    "AdvancedModel.mat",
    "Dataset.csv",
  ];

  // Card options
  const cardOptions = [
    { title: "Blank", description: "Start from scratch" },
    { title: "Basic NN", description: "Create a simple Neural Network" },
    { title: "Advanced Model", description: "Pre-built advanced structures" },
    { title: "Import Dataset", description: "Start with a dataset" },
  ];

  return (
    <div className="dashboard-container">
      {/* Left Pane */}
      <div className="recent-files-pane">
        <Text variant="large" block>
          Recently Opened Files
        </Text>
        <ul className="recent-files-list">
          {recentFiles.map((file, index) => (
            <li key={index} className="recent-file-item">
              <Button appearance="transparent" onClick={() => alert(file)}>
                {file}
              </Button>
            </li>
          ))}
        </ul>
      </div>

      {/* Right Pane */}
      <div className="options-pane">
        <Text variant="large" block>
          Choose an Option
        </Text>
        <div className="cards-container">
          {cardOptions.map((option, index) => (
            <Card key={index} className="option-card" onClick={() => alert(option.title)}>
              <CardHeader headerText={option.title} />
              <CardFooter>
                <Text>{option.description}</Text>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Homepage;