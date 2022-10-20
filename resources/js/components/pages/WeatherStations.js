import React, { useContext } from "react";
import { Badge, Col, Row, Table } from "react-bootstrap";
import Icon from "../layouts/Icon";
import { WeatherStationContext } from "./../contexts/WeatherStationContext";

function WeatherStations() {
    let { dataset } = useContext(WeatherStationContext);

    const render_fields = (type) => {
        return dataset
            .filter((data) => data.category == type)
            .map((data, index) => {
                return (
                    <Icon
                        style={{ width: "43.20px" }}
                        key={index}
                        tooltip={`Site: ${data.file}`}
                        {...data}
                    >
                        {data.type}
                    </Icon>
                );
            });
    };

    return (
        <Row>
            <Col>
                <h4>
                    <Badge bg="light" text="success">
                        AWS & ARG Data
                    </Badge>
                </h4>
                <Table bordered responsive size="sm">
                    <thead>
                        <tr>
                            <th className="text-center">aws</th>
                            <th className="text-center">arg</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{render_fields("aws")}</td>
                            <td>{render_fields("arg")}</td>
                        </tr>
                    </tbody>
                </Table>
            </Col>
        </Row>
    );
}

export default WeatherStations;
