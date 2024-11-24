import { GR } from "@/types";

export const getTerminais = (gr: GR[]) => {
  return [
    ...new Set(
      gr.flatMap((item) => {
        return Object.values(item)
          .join()
          .split("")
          .filter(
            (char) =>
              char === char.toLowerCase() && char !== "," && char !== "&"
          );
      })
    ),
  ];
};

export const geraNovaGR = (rules: string) => {
  const gramatica = rules.split("\n");

  return gramatica.map((item, index) => {
    const naoTerminal = item[0];
    return {
      [naoTerminal]: gramatica[index].split(naoTerminal + "->")[1].split("|"),
    };
  });
};

export const geraDadosAFN = (novaGramatica: GR[], terminais: string[]) => {
  const resultado = novaGramatica.map((item) => {
    const dados: string[] = new Array(terminais.length);
    Object.values(item)[0].forEach((el) => {
      const [t, nt] = el.split("");
      const indexOfTerminal = terminais.findIndex((nt) => nt === t);

      if (nt) {
        if (indexOfTerminal >= 0) {
          if (dados[indexOfTerminal]) {
            dados[indexOfTerminal] = dados[indexOfTerminal] + "," + nt;
          } else {
            dados[indexOfTerminal] = nt;
          }
        }
      }
    });

    const novoDado = dados.map((e) => {
      return e.split(",").sort().join(",");
    });

    return {
      [Object.keys(item)[0]]: novoDado,
    };
  });

  return resultado;
};

export const geraDadosAFD = (afn: GR[], terminais: string[]) => {
  const afd: GR[] = [];
  afd.push(afn[0]);

  let limite = 50;
  while (true) {
    //condição de parada
    if (limite === 0) {
      break;
    }

    let chaveAdicionada = false;

    const chaves = afd.map((obj) => {
      return Object.keys(obj)[0].split(",").sort().join(",");
    });

    Object.values(afd).forEach((e) => {
      const chave = Object.keys(e)[0].split(",").sort().join(",");

      e[chave].forEach((el) => {
        const existsChave = chaves.some((item) => {
          return (
            item.split(",").sort().join(",") === el.split(",").sort().join(",")
          );
        });

        if (!existsChave) {
          const options = el.split(",");

          const novoAr: string[] = new Array(terminais.length);

          options.forEach((opt) => {
            Object.values(afn).forEach((afnOpt) => {
              if (afnOpt[opt]) {
                const indexes = terminais.length;
                for (let i = 0; i < indexes; i++) {
                  if (afnOpt[opt][i]) {
                    if (novoAr[i]) {
                      novoAr[i] = novoAr[i] + "," + afnOpt[opt][i];
                    } else {
                      novoAr[i] = afnOpt[opt][i];
                    }
                  }
                }
              }
            });
          });

          const resultado = novoAr.map((str) => {
            return [...new Set(str.split(","))].sort().join(",");
          });
          const ch = afd.map((it) => Object.keys(it)[0]);

          if (!ch.includes(el)) {
            afd.push({
              [el]: resultado,
            });
          }

          chaveAdicionada = true;
        }
      });
    });

    if (!chaveAdicionada) {
      break;
    }
    limite -= 1;
  }

  const alfabeto = "ABCDEFGHIJKLMNOPQRTUVWXYZ";
  const chaveMap: { [key: string]: string } = {};
  let contador = 0;

  afd.forEach((obj) => {
    const chave = Object.keys(obj)[0];

    if (!chaveMap[chave]) {
      if (chave === "S") {
        chaveMap["S"] = "S";
      } else {
        chaveMap[chave] = alfabeto[contador++];
      }
    }
  });

  const newAFD = afd.map((obj) => {
    const chaveOriginal = Object.keys(obj)[0];
    const novaChave = chaveMap[chaveOriginal];

    const novosValores = obj[chaveOriginal].map((valor) => {
      return (
        chaveMap[valor] ||
        valor
          .split(",")
          .map((subChave) => chaveMap[subChave])
          .join(",")
      );
    });

    return { [novaChave]: novosValores };
  });

  return { newAFD, chaveMap, oldAFD: afd };
};

export const getEstadosAceitacao = (
  novaGramatica: GR[],
  chaveMap: { [key: string]: string }
) => {
  const estadoAceitacaoAFD: string[] = [];
  const estadoAceitacaoAFN: string[] = [];

  novaGramatica.forEach((e) => {
    Object.values(e).forEach((el) => {
      el.forEach((item) => {
        if (item.length === 1) {
          estadoAceitacaoAFN.push(Object.keys(e)[0]);
        }
      });
    });
  });

  Object.keys(chaveMap).forEach((el) => {
    const chaves = el.split(",");

    chaves.forEach((c) => {
      if (estadoAceitacaoAFN.includes(c)) {
        estadoAceitacaoAFD.push(chaveMap[el]);
      }
    });
  });
  return { estadoAceitacaoAFD, estadoAceitacaoAFN };
};
