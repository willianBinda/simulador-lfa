"use client";
import { GR } from "@/types";
import React from "react";
import { Table } from "react-bootstrap";

interface Props {
  gramatica: GR[];
  novoAFD: GR[];
  terminais: string[];
  estadoAceitacao: string[];
  estadoAceitacaoNovaAFD: string[];
}
export default function AFD({
  gramatica,
  terminais,
  estadoAceitacao,
  novoAFD,
  estadoAceitacaoNovaAFD,
}: Props) {
  return (
    <>
      <Table striped bordered className="text-center">
        <tbody>
          <tr>
            <th></th>
            <th>$</th>
            {terminais.map((item, index) => (
              <th key={index}>{item}</th>
            ))}
          </tr>

          {gramatica.map((item, index) => {
            const chave = Object.keys(item)[0];
            const valores = Object.values(item)[0];
            const linhaValores = terminais.map((_, i) => valores[i] || "");
            const isAceitacao = estadoAceitacao.some((letra) =>
              chave.includes(letra)
            );
            if (chave === "S") {
              return (
                <tr key={index}>
                  <th>{isAceitacao ? "->*" : "->"}</th>
                  <th>[{chave}]</th>
                  {linhaValores.map((val, i) => (
                    <td key={i}>{val ? `[${val}]` : ""}</td>
                  ))}
                </tr>
              );
            }

            return (
              <tr key={index}>
                <th>{isAceitacao ? "*" : null}</th>
                <th>[{chave}]</th>
                {linhaValores.map((val, i) => (
                  <td key={i}>{val ? `[${val}]` : ""}</td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </Table>

      <Table striped bordered className="text-center">
        <tbody>
          <tr>
            <th></th>
            <th>$</th>
            {terminais.map((item, index) => (
              <th key={index}>{item}</th>
            ))}
          </tr>

          {novoAFD.map((item, index) => {
            const chave = Object.keys(item)[0];
            const valores = Object.values(item)[0];
            const isAceitacao = estadoAceitacaoNovaAFD.some((letra) =>
              chave.includes(letra)
            );
            const linhaValores = terminais.map((_, i) => valores[i] || "");
            if (chave === "S") {
              return (
                <tr key={index}>
                  <th>{isAceitacao ? "->*" : "->"}</th>
                  <th>{chave}</th>
                  {linhaValores.map((val, i) => (
                    <td key={i}>{val}</td>
                  ))}
                </tr>
              );
            }

            return (
              <tr key={index}>
                <th>{isAceitacao ? "*" : null}</th>
                <th>{chave}</th>
                {linhaValores.map((val, i) => (
                  <td key={i}>{val}</td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </Table>
    </>
  );
}
