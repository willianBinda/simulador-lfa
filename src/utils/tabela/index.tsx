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
  const a = novaGramatica.map((item) => {
    // console.log(item);
    // console.log(Object.keys(item));
    const dados: string[] = new Array(terminais.length);
    Object.values(item)[0].forEach((el) => {
      // console.log("elemento: ", el);

      const [t, nt] = el.split("");
      const indexOfTerminal = terminais.findIndex((nt) => nt === t);
      // console.log("naoTerminal: ", nt, indexOfTerminal);
      if (indexOfTerminal >= 0) {
        if (dados[indexOfTerminal]) {
          dados[indexOfTerminal] = dados[indexOfTerminal] + "," + nt;
        } else {
          dados[indexOfTerminal] = nt;
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

  return { gramatica: a, terminais, estadoAceitacao };
};
