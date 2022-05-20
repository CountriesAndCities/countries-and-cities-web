import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";

import './Message.css';

function Message(props) {
  const message = props.message;

  const ignoreClick = (event) => {
    event.stopPropagation();
  };

  return (
    <Card onClick={() => props.selectedHandler(message)} className="message-margin">
      <CardContent>
        <div>
          <b>Id: </b> <span>{message.id}</span>
        </div>
        <div>
          <b>GlobalId:</b>
          <span onClick={ignoreClick.bind(this)}> {message.globalId}</span>
        </div>
        <div>
          <b>CorrelationId:</b>
          <span onClick={ignoreClick.bind(this)}> {message.correlationId}</span>
        </div>
        <div>
          <b>Meta: </b>{JSON.stringify(message.meta)}
        </div>
        <div>
          <b>Header: </b>{JSON.stringify(message.header)}
        </div>
      </CardContent>
    </Card>
  );
}

export default Message;
