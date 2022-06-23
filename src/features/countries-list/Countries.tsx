import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { autorun } from "mobx";
import { Button, Col, Row } from "antd";
import { CountriesList } from "./CountriesList";
import { CountriesStore } from "./CountriesStore";
import { Heading } from "../../components/Heading";
import { Wrapper } from "../../components/Wrapper";
import { SomethingWentWrong } from "../../components/SomethingWentWrong";
import { links } from "../../App";

const store = new CountriesStore();

export const Countries = () => {
  const [error, setError] = useState(store.error);

  useEffect(() => autorun(() => setError(store.error)), [store.error]);

  useEffect(() => {
    store.fetchCountries();
  }, []);

  return error ? (
    <SomethingWentWrong />
  ) : (
    <Wrapper>
      <Row align="middle">
        <Col flex="auto">
          <Heading>Countries</Heading>
        </Col>
        <Col flex="none">
          <Button>
            <Link to={links.countryCreate}>Add country</Link>
          </Button>
        </Col>
      </Row>
      <br />
      <CountriesList store={store} />
    </Wrapper>
  );
};
