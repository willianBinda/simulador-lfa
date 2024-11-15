"use client";
import { GR } from "@/types";
import React from "react";
import { Table } from "react-bootstrap";

interface Props {
  gramatica: GR[];
  terminais: string[];
  estadoAceitacao: string[];
}
export default function AFD({ gramatica, terminais, estadoAceitacao }: Props) {
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
            if (chave === "S") {
              return (
                <tr key={index}>
                  <th>{"->"}</th>
                  <th>[{chave}]</th>
                  {valores.map((val, i) => (
                    <td key={i}>[{val}]</td>
                  ))}
                </tr>
              );
            }

            const isAceitacao = estadoAceitacao.some((letra) =>
              chave.includes(letra)
            );
            return (
              <tr key={index}>
                <th>{isAceitacao ? "*" : null}</th>
                <th>[{chave}]</th>
                {valores.map((val, i) => (
                  <td key={i}>[{val}]</td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </Table>
    </>
  );
}
