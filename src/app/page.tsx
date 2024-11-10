"use client";
import React, { useState } from "react";
import { Alert, Button, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { validarGramatica } from "@/utils";

export default function Home() {
  const [rules, setRules] = useState("S->aA|bB\nA->aA|&\nB->bB|&");
  const [entrada, setEntrada] = useState("aaaa");
  const [resultado, setResultado] = useState<boolean | null>(null);

  const handleSimulate = () => {
    try {
      validarGramatica(rules, entrada);
      setResultado(true);
    } catch (error) {
      console.log(error);
      setResultado(false);
    }
  };

  const fResultado = () => {
    if (resultado === true) {
      return (
        <Alert variant="success">Strng de entrada aceita na gramática!</Alert>
      );
    } else if (resultado === false) {
      return (
        <Alert variant="danger">
          String de entrada não aceita! Verifique sua gramática!
        </Alert>
      );
    } else return null;
  };

  return (
    <div>
      <h1>Simulador de Linguagem Regular</h1>

      <Form.Control
        as={"textarea"}
        rows={5}
        cols={50}
        value={rules}
        placeholder="Digite sua GR aqui..."
        onChange={(e) => setRules(e.target.value)}
      ></Form.Control>
      <br></br>

      <Form.Control
        placeholder="Digite sua string"
        value={entrada}
        onChange={(e) => setEntrada(e.target.value)}
      />

      <Button onClick={handleSimulate}>Simular</Button>
      {fResultado()}
    </div>
  );
}
