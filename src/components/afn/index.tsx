"use client";
import { GR } from "@/types";
import React from "react";
import { Table } from "react-bootstrap";

interface Props {
  gramatica: GR[];
  terminais: string[];
}
export default function AFN({ gramatica, terminais }: Props) {
  return (
    <>
      <Table striped bordered className="text-center">
        <tbody>
          <tr>
            <th></th>
            <th>#</th>
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
                  <th>{chave}</th>
                  {valores.map((val, i) => (
                    <td key={i}>{val}</td>
                  ))}
                  {/* <td>[A,S]</td>
                  <td>B</td> */}
                </tr>
              );
            }

            return (
              <tr key={index}>
                <th></th>
                <th>{chave}</th>
                {valores.map((val, i) => (
                  <td key={i}>{val}</td>
                ))}
              </tr>
            );
          })}

          {/* <tr>
            <th></th>
            <th>$</th>
            <th>a</th>
            <th>b</th>
          </tr>
          <tr>
            <th>{"->"}</th>
            <th>S</th>
            <td>[A,S]</td>
            <td>B</td>
          </tr>
          <tr>
            <th>*</th>
            <th>A</th>
            <td>S</td>
            <td>A</td>
          </tr>
          <tr>
            <td></td>
            <th>B</th>
            <td>B</td>
            <td>S</td>
          </tr> */}
        </tbody>
      </Table>
    </>
  );
}
