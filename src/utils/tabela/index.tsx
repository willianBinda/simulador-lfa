import { GR } from "@/types";

export const geraTabela = (rules: string) => {
  const gramatica = rules.split("\n");

  const novaGramatica = gramatica.map((item, index) => {
    const naoTerminal = item[0];
    return {
      [naoTerminal]: gramatica[index].split(naoTerminal + "->")[1].split("|"),
    };
  });

  const terminais = [
    ...new Set(
      novaGramatica.flatMap((item) => {
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

  // console.log("terminais: ", terminais);
  // console.log("gr: ", novaGramatica);
  const afn = novaGramatica.map((item) => {
    // console.log(item);
    // console.log(Object.keys(item));
    const dados: string[] = new Array(terminais.length);
    Object.values(item)[0].forEach((el) => {
      // console.log("elemento: ", el);

      const [t, nt] = el.split("");
      const indexOfTerminal = terminais.findIndex((nt) => nt === t);
      // console.log("naoTerminal: ", nt, indexOfTerminal);
      if (nt) {
        if (indexOfTerminal >= 0) {
          if (dados[indexOfTerminal]) {
            dados[indexOfTerminal] = dados[indexOfTerminal] + "," + nt;
          } else {
            dados[indexOfTerminal] = nt;
          }
        }
      }

      // return el;
    });
    // console.log("novos dados");
    // console.log("nao terminais: ", dados);

    return {
      [Object.keys(item)[0]]: dados,
    };
  });

  console.log("afn: ", afn);

  const afd: GR[] = [];
  afd.push(afn[0]);

  console.log("afd: ", afd);
  let limite = 50;

  while (true) {
    //condição de parada
    if (limite === 0) {
      break;
    }

    // console.log(limite);

    limite -= 1;

    const todasAsChaves = afd.map((obj) => Object.keys(obj)[0]);
    // console.log(todasAsChaves);

    Object.values(afd).forEach((e) => {
      const chave = Object.keys(e)[0];
      // console.log(e, chave);
      e[chave].forEach((el) => {
        // console.log(el);
        const exists = todasAsChaves.some(
          (item) =>
            item.split(",").sort().join(",") === el.split(",").sort().join(",")
        );
        if (!exists) {
          console.log(e, el);
          const dados: string[] = new Array(terminais.length);

          const estados = el.split("").filter((item) => item !== ",");

          console.log("estados para verificar: ", estados);

          estados.forEach((est, index) => {
            console.log("estado unico: ", est);
            const a = afn.find((estado) => estado[est]);
            if (a) {
              console.log("estado encontrado: ", a[est], a[est].length);

              if (dados[index]) {
                dados[index] = dados[index] + "," + a[est][index];
              } else {
                dados[index] = a[est][index];
              }
              // a[est].forEach((item) => {
              //   console.log("item encontrado: ", item);
              // });
            }
          });
          console.log("***************");
          console.log("dados: ", dados);
          console.log("***************");
          afd.push({
            [el]: [],
          });
        }
      });
    });
  }
  console.log("resultado: ", afd);

  // console.log("resultado: ", a);
  const estadoAceitacao: string[] = [];
  // console.log(estadoAceitacao);

  novaGramatica.forEach((e) => {
    // console.log(Object.keys(e)[0]);
    Object.values(e).forEach((el) => {
      // console.log(el);
      el.forEach((item) => {
        if (item.length === 1) {
          // console.log("solo: ", item, " chave: ", Object.keys(e)[0]);
          estadoAceitacao.push(Object.keys(e)[0]);
        }
      });
    });
  });

  return { gramatica: afn, terminais, estadoAceitacao };
};
