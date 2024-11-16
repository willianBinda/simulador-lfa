"use client";
import React, { useEffect, useState } from "react";
import styles from "./Catraca.module.css";
import { IoCar } from "react-icons/io5";
import { validarGramatica } from "@/utils";
import { geraEntrada } from "@/utils/catraca";
import { Col, ListGroup, Row } from "react-bootstrap";

export default function Catraca() {
  const [active, setActive] = useState(false);
  const [carStatus, setCarStatus] = useState<
    "offscreen" | "waiting" | "passing"
  >("offscreen");
  const [entradaList, setEntradaList] = useState<
    { entrada: string; valido: boolean }[]
  >([]);
  const gr =
    "S->aA|bA|cA\nA->aB|bB|cB|1B|2B|3B\nB->aC|bC|cC|1C|2C|3C\nC->aD|bD|cD|1D|2D|3D\nD->aE|bE|cE|1E|2E|3E\nE->1|2|3";

  const processEntrada = async () => {
    while (true) {
      const entrada = geraEntrada();
      let isPermitido = false;

      setCarStatus("waiting"); // Carro inicia e para na frente da catraca
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Tempo para o carro chegar à catraca

      try {
        validarGramatica(gr, entrada);
        isPermitido = true;
      } catch (error) {
        console.log("Acesso negado:", error);
      }

      const novaEntrada = { entrada, valido: isPermitido };
      setEntradaList((prevEntradaList) => {
        const updatedList =
          prevEntradaList.length === 10
            ? [...prevEntradaList.slice(1), novaEntrada]
            : [...prevEntradaList, novaEntrada];
        return updatedList;
      });

      if (isPermitido) {
        setActive(true); // Levanta a catraca
        setCarStatus("passing"); // Carro passa pela catraca

        // Espera até o carro passar (3 segundos) e fecha a catraca
        await new Promise((resolve) => setTimeout(resolve, 3000));
        setActive(false);
        setCarStatus("offscreen"); // Carro sai da tela
      } else {
        // Acesso negado, carro volta para fora da tela
        setCarStatus("offscreen");
      }

      // Aguarda para reiniciar o ciclo
      await new Promise((resolve) => setTimeout(resolve, 3000));
    }
  };

  useEffect(() => {
    processEntrada();
  }, []);

  return (
    <div className={styles.container}>
      <Row className={styles.containerRow}>
        <Col md={6}>
          <div className={styles.containerCatraca}>
            <div className={styles.catraca}>
              <div
                className={`${styles.bar} ${active ? styles.active : ""}`}
              ></div>
              <div className={styles.base}></div>
            </div>
            <IoCar
              className={`${styles.car} ${
                carStatus === "waiting"
                  ? styles.carWaiting
                  : carStatus === "passing"
                  ? styles.carPassing
                  : styles.carOffscreen
              }`}
            />
          </div>
        </Col>

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
