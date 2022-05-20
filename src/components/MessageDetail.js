import { useState, useEffect } from "react";
import Message from "./Message";
import Span from "./Span";
import Payload from './Payload';
import config from '../configuration.json';

const MessageDetail = (props) => {
  const [detailState, setDetailState] = useState();
  const fetchDetails = async () => {
    const response = await fetch(
      `${config.domain}/api/messages/${props.message.id}`
    );
    const responseData = await response.json();
    setDetailState(responseData);
  };

  useEffect(() => {
    fetchDetails();
  }, []);

  return (
    <div>
      <h3>Message</h3>
      <Message message={props.message}></Message>
      <h3>Spans</h3>
      {detailState ? detailState.spans.map((item) => (
        <Span span={item} key={item.id} />
      )) : <div>Loading...</div>}
      <h3>Payloads</h3>
      {detailState ? detailState.payloads.map((item) => (
        <Payload payload={item} key={item.hash}/>
        )) : <div>Loading...</div>}
    </div>
  );
};

export default MessageDetail;
