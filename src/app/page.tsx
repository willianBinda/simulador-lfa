"use client";
import React, { useState } from "react";
import {
  Alert,
  Button,
  Card,
  Col,
  Container,
  Form,
  ListGroup,
  Row,
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { isDeterministico, validarGramatica } from "@/utils/index";
import "./global.css";
import Graph from "@/components/grafo";
import { geraGrafo } from "@/utils/grafo";
import { GR, GrafoType } from "@/types";
import AFN from "@/components/afn";
import {
  geraDadosAFD,
  geraDadosAFN,
  geraNovaGR,
  getEstadosAceitacao,
  getTerminais,
} from "@/utils/tabela";
import AFD from "@/components/afd";

export default function Home() {
  const [rules, setRules] = useState("S->aS|aA|bB\nA->aS|bA|&\nB->aB|bS");
  const [entrada, setEntrada] = useState("aaa");
  const [af, setAF] = useState("");
  const [resultado, setResultado] = useState<boolean | null>(null);
  const [dadosGrafo, setDadosGrafo] = useState<GrafoType>({
    edges: [],
    nodes: [],
  });

  const [dadosTabela, setDadosTabela] = useState<{
    afn: GR[];
    oldAFD: GR[];
    newAFD: GR[];
    terminais: string[];
    estadoAceitacaoAFN: string[];
    estadoAceitacaoAFD: string[];
  }>({
    afn: [],
    oldAFD: [],
    newAFD: [],
    terminais: [],
    estadoAceitacaoAFN: [],
    estadoAceitacaoAFD: [],
  });

  const handleSimulate = () => {
    const gr = geraNovaGR(rules);
    const terminais = getTerminais(gr);

    try {
      validarGramatica(gr, entrada);
      setAF(isDeterministico(gr));
      setResultado(true);
    } catch (error) {
      console.log("erro validação: ", error);
      setResultado(false);
    }

    try {
      const data: GrafoType = geraGrafo(gr);
      setDadosGrafo(data);
    } catch (error) {
      console.log("erro no grafo: ", error);
    }

    try {
      const afn = geraDadosAFN(gr, terminais);
      const { chaveMap, oldAFD, newAFD } = geraDadosAFD(afn, terminais);
      const { estadoAceitacaoAFN, estadoAceitacaoAFD } = getEstadosAceitacao(
        gr,
        chaveMap
      );

      setDadosTabela({
        afn: afn,
        oldAFD,
        newAFD,
        terminais,
        estadoAceitacaoAFN,
        estadoAceitacaoAFD,
      });
    } catch (error) {
      console.log("erro tabela: ", error);
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
    <Container className="mt-4">
      <h1 className="text-center mb-4">
        Simulador de Gramática Regular e Autômato Finito
      </h1>

      <Row>
        {/* Coluna da entrada de dados */}
        <Col md={6}>
          <Card className="p-4 shadow-sm">
            <Card.Body>
              <Card.Title>Definir Gramática</Card.Title>
              <Form>
                <Form.Group className="mb-3">
                  <Form.Control
                    as="textarea"
                    rows={5}
                    value={rules}
                    placeholder="Digite sua GR aqui..."
                    onChange={(e) => setRules(e.target.value)}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>String de Entrada</Form.Label>
                  <Form.Control
                    placeholder="Digite sua string"
                    value={entrada}
                    onChange={(e) => setEntrada(e.target.value)}
                  />
                </Form.Group>

                <Button
                  variant="primary"
                  onClick={handleSimulate}
                  className="w-100"
                >
                  Simular
                </Button>
              </Form>
            </Card.Body>
          </Card>
          {fResultado()}
        </Col>

        {/* Coluna de Ajuda */}
        <Col md={6}>
          <Card className="p-4 shadow-sm">
            <Card.Body>
              <Card.Title>Ajuda</Card.Title>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <strong>S</strong> - Estado inicial
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>&</strong> - Estado final
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>|</strong> - Utilizado para separar as opções das
                  regras
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Ex: (a,b,1,...)</strong> - Estados terminais em
                  lowercase
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Ex: (A,B,...)</strong> - Estados não terminais em
                  uppercase
                </ListGroup.Item>
                <ListGroup.Item>
                  Cada linha deve conter uma regra da gramática
                </ListGroup.Item>
                <ListGroup.Item>
                  Não devem conter espaços entre as regras ou símbolos
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Seção dos resultados */}
      {resultado && (
        <>
          <Row className="mt-4">
            <Col xs={12}>
              <Card className="p-3 shadow-sm">
                <Card.Body>
                  <Card.Title>Grafo</Card.Title>
                  <Graph edges={dadosGrafo.edges} nodes={dadosGrafo.nodes} />
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Row className="mt-4">
            <Col>
              <Card className="p-3 shadow-sm">
                <Card.Body>
                  <Card.Title>AFN</Card.Title>
                  <AFN
                    gramatica={dadosTabela.afn}
                    terminais={dadosTabela.terminais}
                    estadoAceitacao={dadosTabela.estadoAceitacaoAFN}
                  />
                </Card.Body>
              </Card>
            </Col>

            {af === "AFN" && (
              <Col>
                <Card className="p-3 shadow-sm">
                  <Card.Body>
                    <Card.Title>AFD</Card.Title>
                    <AFD
                      gramatica={dadosTabela.oldAFD}
                      terminais={dadosTabela.terminais}
                      estadoAceitacao={dadosTabela.estadoAceitacaoAFN}
                      novoAFD={dadosTabela.newAFD}
                      estadoAceitacaoNovaAFD={dadosTabela.estadoAceitacaoAFD}
                    />
                  </Card.Body>
                </Card>
              </Col>
            )}
          </Row>
        </>
      )}
    </Container>
  );
}
