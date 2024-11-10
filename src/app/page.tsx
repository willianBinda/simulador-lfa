"use client";
import React, { useState } from "react";
import { Alert, Button, Col, Form, ListGroup, Row } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { validarGramatica } from "@/utils/index";
import "./global.css";
import Graph from "@/components/grafo";
import { geraGrafo } from "@/utils/grafo";
import { GrafoType } from "@/types";

export default function Home() {
  const [rules, setRules] = useState("S->aA|bB\nA->aA|&\nB->bB|&");
  const [entrada, setEntrada] = useState("aaaa");
  const [resultado, setResultado] = useState<boolean | null>(null);
  const [dadosGrafo, setDadosGrafo] = useState<GrafoType>({
    edges: [],
    nodes: [],
  });

  const handleSimulate = () => {
    try {
      validarGramatica(rules, entrada);
      setResultado(true);
      const data: GrafoType = geraGrafo(rules);
      setDadosGrafo(data);
    } catch (error) {
      console.log(error);
      setResultado(false);
    }
  };

  const fResultado = () => {
    if (resultado === true) {
      return (
        <Alert variant="success" className="mt-3">
          Strng de entrada aceita na gramática!
        </Alert>
      );
    } else if (resultado === false) {
      return (
        <Alert variant="danger" className="mt-3">
          String de entrada não aceita! Verifique sua gramática!
        </Alert>
      );
    } else return null;
  };

  return (
    <div className="container mt-4">
      <Row className="containerGr">
        <Col md={6}>
          <Form>
            <Form.Label>Gramática</Form.Label>
            <Form.Group>
              <Form.Control
                as="textarea"
                rows={5}
                value={rules}
                placeholder="Digite sua GR aqui..."
                onChange={(e) => setRules(e.target.value)}
              />

              <Form.Label>String de entrada</Form.Label>
              <Form.Control
                placeholder="Digite sua string"
                value={entrada}
                onChange={(e) => setEntrada(e.target.value)}
              />
            </Form.Group>

            <Button onClick={handleSimulate} className="mt-3">
              Simular
            </Button>
          </Form>
          {fResultado()}
        </Col>

        <Col
          md={6}
          className="d-flex align-items-center justify-content-center"
        >
          <div>
            <ListGroup horizontal={"sm"} className="my-2">
              <ListGroup.Item>S</ListGroup.Item>
              <ListGroup.Item>Estado inicial</ListGroup.Item>
            </ListGroup>
            <ListGroup horizontal={"sm"} className="my-2">
              <ListGroup.Item>& </ListGroup.Item>
              <ListGroup.Item>Estado final</ListGroup.Item>
            </ListGroup>
          </div>
        </Col>
        {resultado === true ? (
          <Col className="mt-3">
            <Graph edges={dadosGrafo.edges} nodes={dadosGrafo.nodes} />
          </Col>
        ) : null}
      </Row>
    </div>
  );
}
