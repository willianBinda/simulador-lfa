"use client";
import { GR } from "@/types";
import React from "react";
import { Table } from "react-bootstrap";

interface Props {
  gramatica: GR[];
  terminais: string[];
  estadoAceitacao: string[];
}
export default function AFN({ gramatica, terminais, estadoAceitacao }: Props) {
  // console.log(gramatica);
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
            const isAceitacao = estadoAceitacao.includes(chave);
            // console.log(chave);
            // console.log(valores.length);
            // valores.forEach((e, i) => {
            //   console.log("valores[i]: ", e, " - ", i, " - ", valores[i]);
            // });
            // const len = valores.length;
            // for (let ind = 0; ind < len; ind++) {
            //   if (valores[ind]) {
            //     console.log(valores[ind]);
            //   } else {
            //     console.log("index: ", ind, "vazio");
            //   }
            // }
            // console.log("-----------");
            const linhaValores = terminais.map((_, i) => valores[i] || "");
            // console.log(linhaValores);
            if (chave === "S") {
              return (
                <tr key={index}>
                  <th>{isAceitacao ? "-> *" : "->"}</th>
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
