import Card from '@mui/material/Card'; 
import CardContent from '@mui/material/CardContent';

import './Span.css';

const Span = (props) => {
const span = props.span;
  return (
    <Card className="span-margin">
      <CardContent>
        <div><b>CorrelationId:</b> {span.correlationId}</div>
        <div><b>DestinationId:</b> {span.destinationId}</div>
        <div><b>GlobalMessageId:</b> {span.globalMessageId}</div>
        <div><b>Id:</b> {span.id}</div>
        <div><b>MessageId:</b> {span.messageId}</div>
        <div><b>SourceId:</b> {span.sourceId}</div>
      </CardContent>
    </Card>
  );
};

export default Span;
