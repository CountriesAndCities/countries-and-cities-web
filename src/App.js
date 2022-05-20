import { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

import "./App.css";
import Message from "./components/Message";
import MessageDetail from "./components/MessageDetail";
import config from './configuration.json'

const App = () => {
  const [filterState, setFilterState] = useState({
    globalIdParam: "",
    correlationIdParam: "",
  });

  const [messagesState, setMessagesState] = useState([]);
  const [selectedMessageState, setSelectedMessageState] = useState();

  const fetchMessages = async () => {
    const response = await fetch(
      `${config.domain}/api/messages?globalIdParam=${filterState.globalIdParam}&correlationIdParam=${filterState.correlationIdParam}`
    );
    const responseData = await response.json();
    setMessagesState(responseData);
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const filter = () => {
    fetchMessages();
  };

  const handleGlobalIdChange = (event) => {
    setFilterState({
      globalIdParam: event.target.value,
      correlationIdParam: filterState.correlationIdParam,
    });
  };

  const handleCorrelationIdChange = (event) => {
    setFilterState({
      correlationIdParam: event.target.value,
      globalIdParam: filterState.globalIdParam,
    });
  };

  const messageSelectedHandler = (message) => {
    setSelectedMessageState(message);
  };

  const dropState = () => {
    setSelectedMessageState(null);
  };

  return (
    <div className="App">
      <div className="margin-10">
        <TextField
          size="small"
          label="GlobalId"
          variant="outlined"
          value={filterState.globalIdParam}
          onChange={handleGlobalIdChange}
        />
        <TextField
          size="small"
          label="CorrelationId"
          variant="outlined"
          value={filterState.correlationIdParam}
          onChange={handleCorrelationIdChange}
        />
        <Button variant="outlined" size="large" onClick={filter}>
          Filter
        </Button>
        <Button variant="outlined" size="large" onClick={dropState}>
          Back
        </Button>
      </div>
      <div className="margin-10">
        {selectedMessageState ? (
          <MessageDetail message={selectedMessageState}></MessageDetail>
        ) : (
          messagesState.map((item) => (
            <Message
              message={item}
              key={item.id}
              selectedHandler={messageSelectedHandler}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default App;
