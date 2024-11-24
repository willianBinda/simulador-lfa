"use client";
import React, { useState } from "react";
import { Alert, Button, Col, Form, ListGroup, Row } from "react-bootstrap";
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
    <div className="container mt-4">
      <h1>Bem vindo ao Simulador de gramatica regular e Automato finito</h1>
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
          <div className="listaContainer">
            <Form.Label>Ajuda</Form.Label>

            <ListGroup horizontal={"sm"} className="my-2">
              <ListGroup.Item>S</ListGroup.Item>
              <ListGroup.Item className="listC">Estado inicial</ListGroup.Item>
            </ListGroup>

            <ListGroup horizontal={"sm"} className="my-2">
              <ListGroup.Item>&</ListGroup.Item>
              <ListGroup.Item className="listC">Estado final</ListGroup.Item>
            </ListGroup>

            <ListGroup horizontal={"sm"} className="my-2">
              <ListGroup.Item>|</ListGroup.Item>
              <ListGroup.Item className="listC">
                Utilizado para separar as opções das regras
              </ListGroup.Item>
            </ListGroup>

            <ListGroup horizontal={"sm"} className="my-2">
              <ListGroup.Item>Ex: (a,b,1,...)</ListGroup.Item>
              <ListGroup.Item className="listC">
                Estados terminais devem estar em lowercase
              </ListGroup.Item>
            </ListGroup>

            <ListGroup horizontal={"sm"} className="my-2">
              <ListGroup.Item>Ex: (A,B,...)</ListGroup.Item>
              <ListGroup.Item className="listC">
                Estados não terminais devem estar em uppercase
              </ListGroup.Item>
            </ListGroup>

            <ListGroup horizontal={"sm"} className="my-2">
              <ListGroup.Item className="listC">
                Cada linha deve conter uma regra da gramática
              </ListGroup.Item>
            </ListGroup>
            <ListGroup horizontal={"sm"} className="my-2">
              <ListGroup.Item className="listC">
                Não devem conter espaços entre as regras ou símbolos
              </ListGroup.Item>
            </ListGroup>
          </div>
        </Col>

        {resultado === true ? (
          <Col className="mt-3" xs={12}>
            <Form.Label>Grafo</Form.Label>
            <Graph edges={dadosGrafo.edges} nodes={dadosGrafo.nodes} />
          </Col>
        ) : null}
        {/* {resultado === true && af === "AFN" ? ( */}
        {resultado === true ? (
          <>
            <Col className="mt-3">
              <Form.Label>AFN</Form.Label>
              <AFN
                gramatica={dadosTabela.afn}
                terminais={dadosTabela.terminais}
                estadoAceitacao={dadosTabela.estadoAceitacaoAFN}
              />
            </Col>
          </>
        ) : null}

        {resultado === true && af === "AFN" ? (
          <>
            <Col className="mt-3">
              <Form.Label>AFD</Form.Label>
              <AFD
                gramatica={dadosTabela.oldAFD}
                terminais={dadosTabela.terminais}
                estadoAceitacao={dadosTabela.estadoAceitacaoAFN}
                novoAFD={dadosTabela.newAFD}
                estadoAceitacaoNovaAFD={dadosTabela.estadoAceitacaoAFD}
              />
            </Col>
          </>
        ) : null}
      </Row>
    </div>
  );
}
