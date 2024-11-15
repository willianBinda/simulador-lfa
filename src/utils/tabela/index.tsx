import { GR } from "@/types";

export const geraTabela = (rules: string) => {
  // console.log("okoko");
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

      // console.log("terminais: ", terminais);
      // console.log("naoTerminal: ", nt, indexOfTerminal);
      // console.log(t, nt, indexOfTerminal);
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
    // console.log("dados: ", dados);
    // console.log("novos dados");
    // console.log("nao terminais: ", dados);

    return {
      [Object.keys(item)[0]]: dados,
    };
  });

  console.log("afn: ", afn);

  const afd: GR[] = [];
  afd.push(afn[0]);
  // console.log(afd);
  // afd.push(afn[1]);

  // console.log("afd: ", afd);
  let limite = 50;
  // console.log("11111");
  while (true) {
    //condição de parada
    if (limite === 0) {
      break;
    }

    let chaveAdicionada = false;

    const chaves = afd.map((obj) =>
      Object.keys(obj)[0].split(",").sort().join(",")
    );
    // console.log("chaves: ", chaves);
    // console.log("00");
    Object.values(afd).forEach((e) => {
      const chave = Object.keys(e)[0].split(",").sort().join(",");
      // console.log("666");
      e[chave].forEach((el) => {
        // console.log("chaves: ", chaves);
        // console.log("el: ", el);
        const existsChave = chaves.some((item) => {
          // console.log("item: ", item.split(",").sort().join(","));
          // console.log("el: ", el.split(",").sort().join(","));
          return (
            item.split(",").sort().join(",") === el.split(",").sort().join(",")
          );
        });
        // console.log("---------------");
        // console.log("ok");
        // console.log(existsChave);
        if (!existsChave) {
          // console.log("não existe chave ainda.");
          const options = el.split(",");
          // console.log("88");
          // console.log("options: ", options);
          const novoAr: string[] = new Array(terminais.length);
          // console.log(options);
          options.forEach((opt) => {
            // console.log("opt: ", opt, " index: ", index);
            // console.log("chaves afn: ", Object.values(afn));
            Object.values(afn).forEach((afnOpt) => {
              if (afnOpt[opt]) {
                // console.log("opt: ", opt);
                // console.log("afn: ", afnOpt);
                // console.log("afn opt: ", afnOpt[opt]);
                // console.log("afn opt com index: ", afnOpt[opt][index]);
                // console.log("novoArr: ", novoAr);
                const indexes = terminais.length;
                for (let i = 0; i < indexes; i++) {
                  // console.log("afdopt: ", afnOpt[opt]);
                  // console.log("novoarr[i]: ", novoAr[i]);
                  // console.log("afn opt com indice do for: ", afnOpt[opt][i]);
                  if (afnOpt[opt][i]) {
                    if (novoAr[i]) {
                      novoAr[i] = novoAr[i] + "," + afnOpt[opt][i];
                    } else {
                      novoAr[i] = afnOpt[opt][i];
                    }
                  }
                }

                // console.log("novoArrdepois: ", novoAr);
                // console.log("------------");
              }
            });
          });
          // console.log(novoAr);
          const resultado = novoAr.map((str) => {
            // console.log("mimi");
            // console.log("str: ", str);
            return [...new Set(str.split(","))].sort().join(",");
          });
          // console.log("novo arrFinal:", resultado);
          // console.log("------------");
          // console.log("primeira: ", p, " segunda: ", s);
          const ch = afd.map((it) => Object.keys(it)[0]);
          // console.log(ch);
          if (!ch.includes(el)) {
            afd.push({
              [el]: resultado,
            });
          }

          chaveAdicionada = true;
        }
      });
    });
    // console.log(limite);
    if (!chaveAdicionada) {
      break;
    }
    limite -= 1;
  }
  console.log("afd: ", afd);

  // function geradorAlfabeto() {
  //   const alfabeto = "ABCDEFGHIJKLMNOPQRTUVWXYZ";
  //   let index = 0;

  //   return function () {
  //     if (index >= alfabeto.length) {
  //       return null; // Retorna `null` se acabar o alfabeto
  //     }
  //     return alfabeto[index++]; // Retorna a próxima letra e incrementa o índice
  //   };
  // }

  // const gerarChave = geradorAlfabeto();

  // console.log("AFN: ", afn);
  // console.log("AFD: ", afd);
  const alfabeto = "ABCDEFGHIJKLMNOPQRTUVWXYZ";
  const chaveMap: { [key: string]: string } = {};
  let contador = 0;
  // const novoAFD = afd;

  afd.forEach((obj) => {
    const chave = Object.keys(obj)[0];
    // console.log(obj)
    if (!chaveMap[chave]) {
      if (chave === "S") {
        chaveMap["S"] = "S";
      } else {
        chaveMap[chave] = alfabeto[contador++];
      }
    }
  });
  // console.log(chaveMap);
  // // Passo 2: Substituir as chaves e valores no array original
  const novoAFD = afd.map((obj) => {
    const chaveOriginal = Object.keys(obj)[0];
    const novaChave = chaveMap[chaveOriginal];

    // console.log("chave original: ", chaveOriginal);
    // console.log("nova chave: ", novaChave);
    // const existsChave = chaves.some(
    //   (item) =>
    //     item.split(",").sort().join(",") === el.split(",").sort().join(",")
    // );

    // console.log("obj original: ", obj[chaveOriginal]);
    // Substituir os valores dentro do array
    const novosValores = obj[chaveOriginal].map((valor) => {
      return (
        chaveMap[valor] ||
        valor
          .split(",")
          .map((subChave) => chaveMap[subChave])
          .join(",")
      );
    });
    // console.log("-------------");

    return { [novaChave]: novosValores };
  });

  console.log("novoAFD: ", novoAFD);

  // console.log("resultado: ", a);
  const estadoAceitacao: string[] = [];
  const estadoAceitacaoNovaAFD: string[] = [];
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
  // console.log("aceitacao: ", estadoAceitacao);
  // console.log("chaveMap: ", chaveMap);
  // console.log("chaves: ", Object.keys(chaveMap));
  // console.log("valores: ", Object.values(chaveMap));
  Object.keys(chaveMap).forEach((el) => {
    const chaves = el.split(",");
    // console.log("arr chaves: ", chaves);
    chaves.forEach((c) => {
      if (estadoAceitacao.includes(c)) {
        // console.log("aceitação: ", chaveMap[el]);
        estadoAceitacaoNovaAFD.push(chaveMap[el]);
      }
    });
  });
  // console.log(estadoAceitacaoNovaAFD);
  return {
    gramatica: afn,
    terminais,
    estadoAceitacao,
    afd,
    novoAFD,
    estadoAceitacaoNovaAFD,
  };
};
