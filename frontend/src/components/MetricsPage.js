import React, { useState } from "react";
import { Container, Button, Row, Col } from "react-bootstrap";
import { barXAxisLabels } from "../data/data";
import axios from "axios";

import BarGraph from "./BarGraph";
import "../styles/MetricsPage.css"

function MetricsPage() {
  // An array to hold the data needed to be used by the BarGraph
  const [graphData, setGraphData] = useState([]);

  // Title of the Bar Graph
  const [graphTitle, setGraphTitle] = useState("Total Registered Users");

  // X-title of the Bar Graph
  const [graphXLabel, setGraphXLabel] = useState("Months");

  // Y-title of the Bar Graph
  const [graphYLabel, setGraphYLabel] = useState("User Account Creations");

  // Variable to hold the month with the highest count of users
  const [highestMonth, setHighestMonth] = useState("");

  // Variable to hold the counter of the highest month
  const [highestMonthCount, setHighestMonthCount] = useState(0);

  // Variable to hold the most searched cocktail
  const [mostSearchedCocktail, setMostSearchedCocktail] = useState("");

  // Variable to hold the counter of the most searched cocktail
  const [mostSearchedCounter, setMostSearchedCounter] = useState(0);

  // Variable to hold the most user searched cocktail
  const [mostUserSearchedCocktail, setUserMostSearchedCocktail] = useState("");

  // Variable to hold the counter of the most user searched cocktail
  const [mostUserSearchedCounter, setUserMostSearchedCounter] = useState(0);

  // Variable to hold the most threads
  const [mostThreads, setMostThreads] = useState("");

  // Variable to hold the counter of the most threads
  const [mostThreadCount, setMostThreadCount] = useState(0);

  // Variable to hold the metric selection
  const [selectedMetric, setSelectedMetric] = useState(null);

  /**
   * Fetch total active users and update graph data
   */
  const fetchTotalActiveUsers = () => {
    axios
      .get("http://localhost:3001/totalActiveUsers")
      .then((response) => {
        const creationDates = response.data.creationDates;

        const monthsInOrder = barXAxisLabels;

        const userCountByMonth = new Array(12).fill(0);

        creationDates.forEach((date) => {
          const monthIndex = new Date(date).getMonth();
          userCountByMonth[monthIndex]++;
        });

        const updatedGraphData = monthsInOrder.map((monthName, index) => ({
          label: monthName,
          value: userCountByMonth[index] || 0,
        }));

        const maxUserCreations = Math.max(...userCountByMonth);
        const highestMonthIndex = userCountByMonth.indexOf(maxUserCreations);
        const highestMonthName = monthsInOrder[highestMonthIndex];

        setGraphData(updatedGraphData);
        setGraphTitle("Total Registered Users");
        setGraphXLabel("Months");
        setGraphYLabel("User Account Creations");
        setHighestMonth(highestMonthName);
        setHighestMonthCount(maxUserCreations);

        setSelectedMetric("Total Registered Users");
      })
      .catch((error) => {
        console.error("Error fetching total active users:", error);
      });
  };

  /**
   * Fetch most searched base cocktail and update graph data
   */
  const mostBaseCocktailSearched = () => {
    axios
      .get("http://localhost:3001/mostBaseCocktailSearched")
      .then((response) => {
        const cocktailData = response.data;

        const baseCocktails = {};

        cocktailData.forEach((item) => {
          const cocktailName = item.CocktailName;
          const searchedCounter = item.SearchedCounter || 0;

          if (cocktailName) {
            if (baseCocktails[cocktailName]) {
              baseCocktails[cocktailName] += searchedCounter;
            } else {
              baseCocktails[cocktailName] = searchedCounter;
            }
          }
        });

        let mostSearchedCocktail = "";
        let mostSearchedCounter = 0;
        for (const cocktailName in baseCocktails) {
          if (baseCocktails.hasOwnProperty(cocktailName)) {
            const counter = baseCocktails[cocktailName];
            if (counter > mostSearchedCounter) {
              mostSearchedCounter = counter;
              mostSearchedCocktail = cocktailName;
            }
          }
        }

        const graphData = Object.keys(baseCocktails).map((cocktailName) => ({
          label: cocktailName,
          value: baseCocktails[cocktailName],
        }));

        setGraphData(graphData);
        setGraphTitle("Most Searched Base Cocktail Recipes");
        setGraphXLabel("Cocktails");
        setGraphYLabel("Number of times Searched");

        setMostSearchedCocktail(mostSearchedCocktail);
        setMostSearchedCounter(mostSearchedCounter);
        setSelectedMetric("Most Searched Base Cocktail Recipes");
      })
      .catch((error) => {
        console.error("Error fetching most searched base cocktail:", error);
      });
  };

  /**
   * Fetch most searched user cocktail and update graph data
   */
  const mostUserCocktailSearched = () => {
    axios
      .get("http://localhost:3001/mostUserSearchedCocktails")
      .then((response) => {
        const cocktailData = response.data;

        const useCocktails = {};

        cocktailData.forEach((item) => {
          const cocktailName = item.CocktailName;
          const searchedCounter = item.SearchedCounter || 0;

          if (cocktailName) {
            if (useCocktails[cocktailName]) {
              useCocktails[cocktailName] += searchedCounter;
            } else {
              useCocktails[cocktailName] = searchedCounter;
            }
          }
        });

        let mostUserSearchedCocktail = "";
        let mostUserSearchedCounter = 0;
        for (const cocktailName in useCocktails) {
          if (useCocktails.hasOwnProperty(cocktailName)) {
            const counter = useCocktails[cocktailName];
            if (counter > mostUserSearchedCounter) {
              mostUserSearchedCounter = counter;
              mostUserSearchedCocktail = cocktailName;
            }
          }
        }

        const graphData = Object.keys(useCocktails).map((cocktailName) => ({
          label: cocktailName,
          value: useCocktails[cocktailName],
        }));

        setGraphData(graphData);
        setGraphTitle("Most Searched User Cocktail Recipes");
        setGraphXLabel("Cocktails");
        setGraphYLabel("Number of times Searched");

        setUserMostSearchedCocktail(mostUserSearchedCocktail);
        setUserMostSearchedCounter(mostUserSearchedCounter);
        setSelectedMetric("Most Searched User Cocktail Recipes");
      })
      .catch((error) => {
        console.error("Error fetching most searched user cocktail:", error);
      });
  };

  /**
   * Fetch most commented thread and update graph data
   */
  const mostCommentedThread = () => {
    axios
      .get("http://localhost:3001/mostCommentedThread")
      .then((response) => {
        const threadData = response.data;

        const threads = {};

        threadData.forEach((item) => {
          const threadTitle = item.TopicTitle;
          const threadCounter = item.NumberOfReplies || 0;

          if (threadTitle) {
            if (threads[threadTitle]) {
              threads[threadTitle] += threadCounter;
            } else {
              threads[threadTitle] = threadCounter;
            }
          }
        });

        let thread = "";
        let threadCount = 0;
        for (const threadTitle in threads) {
          if (threads.hasOwnProperty(threadTitle)) {
            const counter = threads[threadTitle];
            if (counter > threadCount) {
              threadCount = counter;
              thread = threadTitle;
            }
          }
        }

        const graphData = Object.keys(threads).map((threadTitle) => ({
          label: threadTitle,
          value: threads[threadTitle],
        }));

        setGraphData(graphData);
        setGraphTitle("Most Commented Thread Posts");
        setGraphXLabel("Thread Title");
        setGraphYLabel("Number of times Commented");

        setMostThreads(thread);
        setMostThreadCount(threadCount);
        setSelectedMetric("Most Commented Thread");
      })
      .catch((error) => {
        console.error("Error fetching total active users:", error);
      });
  };

  return (
    <>
      <Container className="mt-4 mb-4">
        <h2 className="text-center mt-4 mb-4">Select a Metric</h2>
        <Row>
          <Col>
            <Button className="mb-2" onClick={fetchTotalActiveUsers}>
              Total Registered Users
            </Button>
          </Col>
          <Col>
            <Button className="mb-2" onClick={mostBaseCocktailSearched}>
              Most Searched Base Cocktail Recipe
            </Button>
          </Col>
          <Col>
            <Button className="mb-2" onClick={mostUserCocktailSearched}>
              Most Searched User Cocktail Recipe
            </Button>
          </Col>
          <Col>
            <Button className="mb-2" onClick={mostCommentedThread}>
              Most Commented Thread
            </Button>
          </Col>
        </Row>
      </Container>
      <Container>
        <BarGraph
          graphData={graphData}
          title={graphTitle}
          xLabel={graphXLabel}
          yLabel={graphYLabel}
        />
      </Container>
      <Container className="text-center mt-4 mb-4">
        {selectedMetric === "Total Registered Users" && (
          <>
            <p className="fs-1">
              Month with the highest user account creations:
              <span className="fw-bold fs-1 bold-text margin-left-10">
                {highestMonth}
              </span>
            </p>
            <p className="fs-1">
              Count:
              <span className="fw-bold fs-1 bold-text margin-left-10">
                {highestMonthCount}
              </span>
            </p>
          </>
        )}

        {selectedMetric === "Most Searched Base Cocktail Recipes" && (
          <>
            <p className="fs-1">
              Most Searched Base Cocktail Recipe:
              <span className="fw-bold fs-1 bold-text margin-left-10">
                {mostSearchedCocktail}
              </span>
            </p>
            <p className="fs-1">
              Count:
              <span className="fw-bold fs-1 bold-text margin-left-10">
                {mostSearchedCounter}
              </span>
            </p>
          </>
        )}

        {selectedMetric === "Most Searched User Cocktail Recipes" && (
          <>
            <p className="fs-1">
              Most Searched User Cocktail Recipe:
              <span className="fw-bold fs-1 bold-text margin-left-10">
                {mostUserSearchedCocktail}
              </span>
            </p>
            <p className="fs-1">
              Count:
              <span className="fw-bold fs-1 bold-text margin-left-10">
                {mostUserSearchedCounter}
              </span>
            </p>
          </>
        )}

        {selectedMetric === "Most Commented Thread" && (
          <>
            <p className="fs-1">
              Highest commented Thread Title:
              <span className="fw-bold fs-1 bold-text margin-left-10">
                {mostThreads}
              </span>
            </p>
            <p className="fs-1">
              Number of times commented:
              <span className="fw-bold fs-1 bold-text margin-left-10">
                {mostThreadCount}
              </span>
            </p>
          </>
        )}
      </Container>
    </>
  );
}

export default MetricsPage;
