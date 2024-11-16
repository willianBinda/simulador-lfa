"use client";
import React, { useEffect, useState } from "react";
import styles from "./Catraca.module.css";
import { IoCar } from "react-icons/io5";
import { validarGramatica } from "@/utils";
import { geraEntrada } from "@/utils/catraca";
import { Col, ListGroup, Row } from "react-bootstrap";

export default function Catraca() {
  const [active, setActive] = useState(false);
  const [carPassing, setCarPassing] = useState(false);
  const [carVisible, setCarVisible] = useState(true);
  const [entradaList, setEntradaList] = useState<
    { entrada: string; valido: boolean }[]
  >([]);
  const gr =
    "S->aA|bA|cA\nA->aB|bB|cB|1B|2B|3B\nB->aC|bC|cC|1C|2C|3C\nC->aD|bD|cD|1D|2D|3D\nD->aE|bE|cE|1E|2E|3E\nE->1|2|3";

  const processEntrada = async () => {
    while (true) {
      const entrada = geraEntrada();
      let isPermitido = false;

      try {
        validarGramatica(gr, entrada);
        isPermitido = true;
      } catch (error) {
        console.log(error);
      }

      const novaEntrada = { entrada: entrada, valido: isPermitido };
      setEntradaList((prevEntradaList) => {
        const updatedList =
          prevEntradaList.length === 10
            ? [...prevEntradaList.slice(1), novaEntrada]
            : [...prevEntradaList, novaEntrada];
        return updatedList;
      });

      if (isPermitido) {
        // Inicia a sequência de animação se permitido
        setActive(true);
        setCarPassing(true);

        // Espera 3 segundos antes de esconder o carro e fechar a catraca
        await new Promise((resolve) => setTimeout(resolve, 3000));
        setCarPassing(false);
        setCarVisible(false);

        // Aguarda mais 1 segundo para baixar a catraca
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setActive(false);

        // Aguarda mais 1 segundo antes de reiniciar o ciclo com o carro visível
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setCarVisible(true);
      } else {
        setCarVisible(false);
        await new Promise((resolve) => setTimeout(resolve, 200));
        setCarVisible(true);
      }

      // Aguarda um intervalo para evitar execuções contínuas
      await new Promise((resolve) => setTimeout(resolve, 3000));
    }
  };

  useEffect(() => {
    processEntrada();
  }, []);

  return (
    <div className="container mt-4">
      <Row className={`${styles.containerRow} d-flex justify-content-center`}>
        {/* Coluna para animação da catraca */}
        <Col
          md={6}
          className="d-flex justify-content-center align-items-center"
        >
          <div className={styles.container}>
            <div className={styles.catraca}>
              <div
                className={`${styles.bar} ${active ? styles.active : ""}`}
              ></div>
              <div className={styles.base}></div>
            </div>
            {carVisible && (
              <IoCar
                className={`${styles.car} ${
                  carPassing ? styles.carPassing : ""
                }`}
              />
            )}
          </div>
        </Col>

        {/* Coluna para a lista */}
        <Col md={6} className={styles.lista}>
          <ListGroup>
            {entradaList.map((entrada, index) => (
              <ListGroup.Item
                key={index}
                className={
                  entrada.valido ? styles.itemListAceita : styles.itemListNegada
                }
              >
                Acesso {entrada.valido ? "permitido!" : "negado!"} Placa:{" "}
                {entrada.entrada}
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Col>
      </Row>
    </div>
  );
}
