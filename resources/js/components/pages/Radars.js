import React, { useContext, useState } from "react";
import { Badge, Col, Row, Table } from "react-bootstrap";
import Moment from "react-moment";
import Icon from "../layouts/Icon";
import RadarStatusModal from "../modals/RadarStatusModal";
import { ACTIONS } from "./../contexts/AppContext";
import { RadarContext } from "./../contexts/RadarContext";

function Radars() {
    let { radars, recipients, dispatch } = useContext(RadarContext);
    let [showModal, setShowModal] = useState(false);
    let [selectRadar, setSelectRadar] = useState({});

    const show_modal = (radar) => {
        setSelectRadar(radar);
        setShowModal(true);
    };

    const render_headers = () => {
        return (
            <tr>
                <th className="text-center">Radar Name</th>
                {recipients.map((recipient) => (
                    <th key={recipient} className="text-center text-uppercase">
                        {recipient}
                    </th>
                ))}
            </tr>
        );
    };

    const render_data = (array) => {
        return array.map((item, index) => {
            let { file, type } = item;

            return (
                <Icon key={index} tooltip={`File: ${file}`} {...item}>
                    {type}
                </Icon>
            );
        });
    };

    const render_fields = (data) => {
        if (Object.keys(data).length == 0) return;

        return (
            <>
                {recipients.map((recipient) => {
                    return (
                        <td key={recipient}>
                            {render_data(data[recipient] ?? [])}
                        </td>
                    );
                })}
            </>
        );
    };

    const render_status = (radar) => {
        let bg = "danger",
            text = "light",
            label = "DOWN";

        if (radar.status == 3) {
            bg = "warning";
            text = "secondary";
            label = "REPORT";
        }

        return (
            <div style={{ display: "flex", flexDirection: "column" }}>
                <div style={{ display: "flex" }}>
                    <div>
                        <Badge
                            bg={bg}
                            text={text}
                            style={{ marginRight: "5px" }}
                        >
                            {label}
                        </Badge>
                    </div>
                    <div>{radar.remarks ?? ""}</div>
                </div>
                <div>
                    <Badge
                        bg="light"
                        text="secondary"
                        style={{ fontSize: "10px" }}
                    >
                        {radar.posted_by}{" "}
                        <Moment date={radar.date_posted} format="L h:mm A" />
                    </Badge>
                </div>
            </div>
        );
    };

    const check_status = (radar) => {
        let { status, remarks, data } = radar;
        if (status == 0) {
            return (
                <>
                    <td
                        style={{ wordBreak: "break-all" }}
                        colSpan={recipients.length}
                    >
                        {render_status(radar)}
                    </td>
                </>
            );
        }

        if (status == 2) {
            return (
                <>
                    <td colSpan={recipients.length}>
                        <Badge bg="info" text="light">
                            UNDER DEVELOPMENT
                        </Badge>
                    </td>
                </>
            );
        }

        return render_fields(data);
    };

    const render_radars = () => {
        return (
            <>
                {radars.map((radar, index) => {
                    let { name, category } = radar,
                        updateBtn = (
                            <a
                                href="#"
                                className="text-decoration-none text-reset px-2"
                                onClick={() => show_modal(radar)}
                            >
                                <i className="bi bi-pencil-square"></i>
                            </a>
                        );

                    return (
                        <React.Fragment key={index}>
                            <tr>
                                <td
                                    style={{ verticalAlign: "middle" }}
                                    rowSpan={radar.status == 3 ? 2 : 1}
                                >
                                    <div
                                        className="px-2"
                                        style={{ whiteSpace: "nowrap" }}
                                    >
                                        {window.user_name != "Guest" &&
                                        name != "mosaic"
                                            ? updateBtn
                                            : ""}
                                        <span
                                            className="text-capitalize"
                                            style={{
                                                fontWeight: "bold",
                                                opacity: 0.75,
                                            }}
                                        >
                                            {`${name} ${category}`}
                                        </span>
                                    </div>
                                </td>
                                {check_status(radar)}
                            </tr>
                            {radar.status == 3 && (
                                <tr>
                                    <td
                                        style={{ wordBreak: "break-all" }}
                                        colSpan={recipients.length}
                                    >
                                        {render_status(radar)}
                                    </td>
                                </tr>
                            )}
                        </React.Fragment>
                    );
                })}
            </>
        );
    };

    return (
        <Row>
            <Col>
                <h4>
                    <Badge bg="light" text="success">
                        Radar Data
                    </Badge>
                </h4>
                <RadarStatusModal
                    show={showModal}
                    setShow={setShowModal}
                    radar={selectRadar}
                    setRadar={setSelectRadar}
                    dispatch={dispatch}
                    action={ACTIONS.RADAR_STATUS_UPDATE}
                />
                <Table bordered responsive size="sm">
                    <thead>{render_headers()}</thead>
                    <tbody>{render_radars()}</tbody>
                </Table>
            </Col>
        </Row>
    );
}

export default Radars;
