import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";

import './Payload.css';

const Payload = (props) => {
  return (
    <Card className="payload-margin">
      <CardContent>
        <div>
          <b>Hash:</b> {props.payload.hash}
        </div>
        <div>
          <b>Content:</b> {props.payload.content}
        </div>
      </CardContent>
    </Card>
  );
};

export default Payload;
