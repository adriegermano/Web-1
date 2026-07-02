# Aula prática: introdução ao React, reconstruindo o gerenciador de tarefas

Disciplina: Desenvolvimento para Web I
Curso: Sistemas de Informação
Projeto: gerenciador de tarefas (agora em React)

Esta é a nossa última aula, e a proposta é abrir a porta para o React. Você já construiu um gerenciador de tarefas inteiro com HTML, CSS e JavaScript puro. Agora vamos reconstruir esse mesmo aplicativo usando React, e essa repetição é proposital: como você já conhece o resultado final, vai conseguir enxergar com clareza o que muda na forma de pensar e de escrever o código. O objetivo não é decorar uma biblioteca nova, e sim entender por que ela existe e o que ela resolve.

Faça as etapas na ordem, porque cada uma aproveita o que a anterior deixou pronto, exatamente como no roteiro de JavaScript. Tudo será feito e executado no Codespace do GitHub, então não é preciso instalar nada na sua máquina.

## O que você já sabe e vamos reaproveitar

Você já trabalhou com `let` e `const`, arrays e arrays de objetos, os métodos `push`, `find`, `filter` e `map`/`forEach`, template literals, igualdade estrita com `===`, funções que retornam valor com `return`, eventos como clique e tecla, leitura de campos de formulário, controle de classes do CSS, e persistência com `localStorage` usando `JSON.stringify` e `JSON.parse`. Tudo isso reaparece aqui, só que organizado de um jeito diferente. Quem fez o trabalho pesado de aprender JavaScript já tem a base do React.

## O que você vai aprender de novo

1. O que é o React e qual problema ele resolve, e a diferença entre programar de forma imperativa e declarativa.
2. Componentes, as peças reutilizáveis que formam a interface.
3. JSX, uma forma de escrever a aparência do componente que mistura a cara do HTML com o poder do JavaScript.
4. Props, a maneira de passar dados de um componente para outro.
5. Estado com o hook `useState`, que é a memória de um componente.
6. Renderização declarativa: você descreve como a tela deve ser, e o React cuida de atualizá-la.
7. Renderização de listas com `map` e a importância da `key`.
8. Eventos no React, com `onClick` e `onChange`.
9. Campos controlados, em que o estado é a fonte da verdade do formulário.
10. Renderização condicional, para mostrar ou esconder partes da tela.
11. Efeitos colaterais com o hook `useEffect`, usado aqui para salvar no `localStorage`.

## A grande mudança de mentalidade

No roteiro de JavaScript, toda vez que algo mudava, você dava ordens passo a passo ao navegador: "crie um `li`, coloque a classe `tarefa`, adicione um `span`, escreva o texto, encaixe na lista". Isso se chama programação imperativa, você descreve o **como**, o caminho até o resultado.

O React trabalha de outro jeito, chamado declarativo. Você descreve **o que** a tela deve mostrar para um determinado conjunto de dados, e o React se encarrega de mexer no HTML para que a tela fique daquele jeito. Em vez de você mandar "apague a lista e desenhe de novo", você diz "para estas tarefas, a tela é assim", e quando os dados mudam o React recalcula e atualiza só o que for necessário.

Aquela função `exibirTarefas` que você reescrevia a cada etapa, limpando o `innerHTML` e recriando tudo na mão, simplesmente desaparece. No lugar dela, o componente descreve a tela uma vez, e o React redesenha sozinho sempre que os dados mudam. Guardar essa ideia desde já ajuda a entender tudo o que vem a seguir.

---

## Conceitos de base: o que é o React

O React é uma biblioteca de JavaScript para construir interfaces. A ideia central é dividir a tela em **componentes**, que são pedaços independentes e reutilizáveis. Um botão pode ser um componente, um item da lista pode ser um componente, a aplicação inteira é um componente que contém os outros dentro dele. Pense em blocos de montar: cada bloco sabe se desenhar, e você combina blocos para formar coisas maiores.

Cada componente, no fundo, é uma função JavaScript que devolve a descrição de um pedaço de tela. Essa descrição é escrita em JSX, que veremos já a seguir.

Há dois conceitos que governam um componente. As **props** são os dados que chegam de fora, vindos de quem usou o componente, e o componente não pode alterá-las, só lê. O **estado** é a memória interna do componente, dados que podem mudar com o tempo, como o texto que o usuário está digitando ou a lista de tarefas. Quando o estado muda, o React redesenha o componente. Essa é a engrenagem principal: estado muda, tela atualiza.

### JSX, o HTML que vive dentro do JavaScript

Olhe este pequeno componente:

```jsx
function Saudacao() {
  const nome = "Maria";
  return <h1>Olá, {nome}!</h1>;
}
```

Aquilo que parece HTML dentro do `return` é JSX. Ele se parece muito com o HTML que você já conhece, mas roda dentro do JavaScript e por isso permite inserir valores com chaves `{ }`, do mesmo jeito que o `${ }` dos template literals. O `{nome}` coloca o valor da variável dentro da tela.

Três detalhes mudam em relação ao HTML puro, e vale conhecê-los logo:

- O atributo `class` vira `className`, porque `class` é uma palavra reservada do JavaScript. Então onde você escrevia `<li class="tarefa">`, em JSX escreve `<li className="tarefa">`.
- Todo componente precisa devolver **um único elemento raiz**. Se você quiser devolver vários elementos lado a lado sem criar uma `div` extra, envolva tudo em `<> ... </>`, que se chama fragmento.
- As chaves `{ }` aceitam qualquer expressão JavaScript: uma variável, uma conta, uma chamada de função. É essa mistura que dá o poder do JSX.

```jsx
function Exemplo() {
  const total = 2 + 3;
  return (
    <>
      <h1 className="titulo">Resultado</h1>
      <p>O total é {total}</p>
    </>
  );
}
```

Repare também que, quando o JSX ocupa mais de uma linha, é costume envolvê-lo em parênteses depois do `return`, só para organizar.

---

## Etapa 0: criar o projeto no Codespace

Objetivo: deixar o ambiente do React pronto e rodando dentro do Codespace. Nesta etapa ainda não escrevemos lógica do projeto, só preparamos o terreno.

Diferente do roteiro de JavaScript, em que bastava abrir o `index.html` no navegador, o React precisa de uma ferramenta que transforme os componentes e o JSX em algo que o navegador entenda. Vamos usar o **Vite**, que monta o projeto e oferece um servidor de desenvolvimento que recarrega a página sozinho a cada alteração.

Com o seu Codespace aberto, vá até o terminal (menu superior, Terminal, New Terminal) e rode o comando abaixo. Ele cria um projeto React já configurado dentro de uma pasta chamada `tarefas-react`:

```bash
npm create vite@latest tarefas-react -- --template react
```

Quando o comando terminar, entre na pasta e instale as dependências:

```bash
cd tarefas-react
npm install
```

Agora suba o servidor de desenvolvimento:

```bash
npm run dev
```

O Codespace vai detectar que uma aplicação subiu em uma porta e mostrar um aviso oferecendo abrir no navegador (botão "Open in Browser" ou a aba "Ports"). Clique para abrir. Você verá a página inicial de exemplo do Vite com React. Deixe esse `npm run dev` rodando o tempo todo: a cada vez que você salvar um arquivo, a página atualiza sozinha.

Sobre os comandos:

- `npm create vite@latest` baixa e executa a ferramenta do Vite que cria o esqueleto do projeto. O trecho `--template react` diz que queremos o modelo já preparado para React. O `npm` é o gerenciador de pacotes do Node, que vem instalado no Codespace.
- `npm install` lê o arquivo `package.json`, que lista as bibliotecas de que o projeto precisa, e baixa todas para a pasta `node_modules`. É um passo obrigatório antes de rodar o projeto pela primeira vez.
- `npm run dev` inicia o servidor de desenvolvimento do Vite. Ele observa os arquivos e recarrega o navegador a cada mudança, o que torna o desenvolvimento muito rápido.

### Limpando o projeto de exemplo

O Vite cria alguns arquivos de demonstração que não vamos usar. Vamos deixar a casa arrumada antes de começar.

Abra a pasta `src`, que é onde mora o código da aplicação. Apague o arquivo `App.css`. Em seguida, substitua todo o conteúdo do arquivo `src/App.jsx` por isto, que é o nosso ponto de partida limpo:

```jsx
function App() {
  return (
    <main className="app">
      <h1>Minhas Tarefas</h1>
    </main>
  );
}

export default App;
```

E substitua todo o conteúdo de `src/main.jsx` por isto:

```jsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
```

Sobre os comandos:

- O `import` traz código de outro arquivo ou biblioteca para este. É a forma organizada de o React dividir o programa em vários arquivos que se enxergam. No `main.jsx` importamos o React, a ferramenta que o coloca na tela, o nosso componente `App` e o arquivo de estilos.
- O `export default App` no fim do `App.jsx` faz o contrário: ele disponibiliza o componente `App` para que outros arquivos possam importá-lo. Todo componente que você quiser usar em outro lugar precisa ser exportado.
- A última linha do `main.jsx` é o ponto de partida da aplicação. Ela encontra a `div` de `id` `root` que existe no `index.html`, e manda o React desenhar o componente `<App />` dentro dela. Repare que um componente é usado como se fosse uma tag, `<App />`. Daqui para frente, quase todo o nosso trabalho será dentro da pasta `src`.

### O CSS do projeto

Para focarmos no React e não no CSS, vamos reaproveitar o estilo que você já construiu no projeto de JavaScript. Abra o arquivo `src/index.css`, apague o que houver dentro dele e cole o CSS abaixo. Ele é praticamente o mesmo de antes, então as regras já são suas conhecidas:

```css
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', Arial, sans-serif;
  background-color: #eef1f6;
  color: #222;
  display: flex;
  justify-content: center;
  padding: 40px 16px;
}

.app {
  background-color: #ffffff;
  width: 100%;
  max-width: 480px;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
}

h1 {
  font-size: 1.6rem;
  margin-bottom: 16px;
  text-align: center;
}

ul {
  list-style: none;
}

.entrada {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
}

.entrada input {
  flex: 1;
  padding: 10px;
  border: 1px solid #c8cfdb;
  border-radius: 8px;
  font-size: 1rem;
}

.entrada button {
  padding: 10px 16px;
  border: none;
  border-radius: 8px;
  background-color: #3b82f6;
  color: #ffffff;
  cursor: pointer;
}

.entrada button:hover {
  background-color: #2f6fe0;
}

.filtros {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
}

.filtro {
  flex: 1;
  padding: 8px;
  border: 1px solid #c8cfdb;
  background-color: #ffffff;
  border-radius: 8px;
  cursor: pointer;
}

.filtro.ativo {
  background-color: #3b82f6;
  color: #ffffff;
  border-color: #3b82f6;
}

.tarefa {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  border: 1px solid #e2e6ee;
  border-radius: 8px;
  margin-bottom: 8px;
}

.tarefa span {
  cursor: pointer;
}

.tarefa.concluida span {
  text-decoration: line-through;
  color: #9aa3b2;
}

.remover {
  border: none;
  background-color: #ef4444;
  color: #ffffff;
  padding: 6px 10px;
  border-radius: 6px;
  cursor: pointer;
}

#contador,
.contador {
  margin-top: 12px;
  text-align: center;
  color: #555;
}

.vazio {
  text-align: center;
  color: #888;
  padding: 16px;
}
```

Salve tudo. No navegador você deve ver o cartão branco com o título "Minhas Tarefas" centralizado. A partir daqui o trabalho é todo em React, dentro da pasta `src`.

---

## Etapa 1: exibir uma lista de tarefas

Objetivo: guardar as tarefas e mostrá-las na tela, mas agora do jeito do React. Aqui aparecem o JSX, a renderização de listas com `map` e a `key`.

Lembre da versão em JavaScript: você tinha um array `tarefas` e uma função `exibirTarefas` que percorria esse array montando o HTML na mão. No React, o array continua, mas a função de exibir some. Em vez disso, o componente descreve a tela a partir do array, e o React desenha.

Substitua o conteúdo de `src/App.jsx` por este:

```jsx
function App() {
  // Um array de objetos. Cada objeto é uma tarefa.
  const tarefas = [
    { id: 1, texto: "Estudar React", concluida: false },
    { id: 2, texto: "Entender componentes", concluida: true },
    { id: 3, texto: "Praticar JSX", concluida: false }
  ];

  return (
    <main className="app">
      <h1>Minhas Tarefas</h1>

      <ul>
        {tarefas.map(function (tarefa) {
          return (
            <li className="tarefa" key={tarefa.id}>
              <span>{tarefa.texto}</span>
            </li>
          );
        })}
      </ul>
    </main>
  );
}

export default App;
```

Salve e veja as três tarefas aparecerem na tela.

Sobre os comandos:

- O array `tarefas` é igual ao do projeto anterior, um array de objetos com `id`, `texto` e `concluida`. Nada de novo aqui, e isso é de propósito: a forma de guardar os dados continua a mesma.
- A grande novidade está dentro do `<ul>`. Usamos as chaves `{ }` para entrar no modo JavaScript dentro do JSX, e ali chamamos `tarefas.map(...)`. O método `map` percorre o array e devolve um **novo array**, transformando cada item no que a função interna retornar. Aqui cada tarefa vira um elemento `<li>` em JSX. Ao final, temos um array de elementos, e o React sabe desenhar um array de elementos na tela, um atrás do outro.
- Por que `map` e não `forEach`? Porque o `map` devolve um valor, justamente o array de elementos que o JSX precisa exibir. O `forEach` não devolve nada, ele só executa. No React, sempre que você for transformar uma lista de dados em uma lista de elementos, o método é o `map`.
- Repare na `key={tarefa.id}`. Toda vez que você cria uma lista de elementos com `map`, o React pede que cada um tenha uma `key`, um identificador único entre os irmãos. É com a `key` que o React consegue saber qual item mudou, qual foi adicionado e qual foi removido, e assim atualizar a tela com eficiência, sem redesenhar a lista inteira. Usar o `id` da tarefa como `key` é o ideal, porque ele é único. Evite usar a posição do item como `key`, pois ela muda quando itens são adicionados ou removidos.

Compare mentalmente com a versão antiga: lá você escrevia `createElement`, `classList.add`, `textContent` e `appendChild` para cada item. Aqui você simplesmente escreve o `<li>` como ele deve ser, e deixa o `map` repetir para cada tarefa. Menos passos, e a descrição da tela fica junta e fácil de ler.

---

## Etapa 2: quebrar a tela em componentes

Objetivo: separar o item da tarefa em um componente próprio e aprender a passar dados com props. Aqui entram os componentes reutilizáveis e as props.

Hoje todo o JSX está dentro de `App`. Funciona, mas conforme o projeto cresce, juntar tudo num componente só vira uma confusão, do mesmo jeito que misturar HTML, CSS e JS num arquivo só ficava ruim. A solução do React é criar componentes menores, cada um com a sua responsabilidade. Vamos extrair o item da lista para um componente chamado `Tarefa`.

Crie um arquivo novo em `src/Tarefa.jsx` com este conteúdo:

```jsx
function Tarefa(props) {
  return (
    <li className="tarefa">
      <span>{props.tarefa.texto}</span>
    </li>
  );
}

export default Tarefa;
```

Agora volte ao `src/App.jsx` e use esse novo componente dentro do `map`. Não esqueça de importá-lo no topo do arquivo:

```jsx
import Tarefa from "./Tarefa.jsx";

function App() {
  const tarefas = [
    { id: 1, texto: "Estudar React", concluida: false },
    { id: 2, texto: "Entender componentes", concluida: true },
    { id: 3, texto: "Praticar JSX", concluida: false }
  ];

  return (
    <main className="app">
      <h1>Minhas Tarefas</h1>

      <ul>
        {tarefas.map(function (tarefa) {
          return <Tarefa key={tarefa.id} tarefa={tarefa} />;
        })}
      </ul>
    </main>
  );
}

export default App;
```

Salve. A tela continua igual, mas a organização do código melhorou bastante.

Sobre os comandos:

- O componente `Tarefa` é uma função, assim como `App`. A diferença é que ele recebe um parâmetro chamado `props`. As **props** são os dados que o componente recebe de fora, de quem o usou. É a forma de um componente pai passar informação para um componente filho.
- No `App`, ao escrever `<Tarefa key={tarefa.id} tarefa={tarefa} />`, estamos usando o componente como uma tag e passando para ele duas informações. A `key`, como já vimos, é exigência do React para listas. E `tarefa={tarefa}` é uma prop comum: estamos entregando o objeto da tarefa para dentro do componente. O nome à esquerda do `=` é como a prop se chama, e o valor entre chaves é o que enviamos.
- Lá dentro de `Tarefa`, recuperamos esse valor com `props.tarefa`, e dele lemos o texto com `props.tarefa.texto`. As props chegam sempre agrupadas nesse objeto `props`.
- Um detalhe importante: o componente **não pode alterar** as props que recebe, ele só as lê. As props são de mão única, descem do pai para o filho. Quem manda na tarefa é o `App`, que a passou para baixo. Isso mantém o fluxo de dados previsível: para saber de onde veio um valor, basta olhar para cima, para quem passou a prop.

### Uma forma mais limpa de receber props

Em quase todo código React que você encontrar, as props são recebidas já "desempacotadas" entre chaves, em vez de pelo objeto `props` inteiro. Veja a mesma coisa escrita assim:

```jsx
function Tarefa({ tarefa }) {
  return (
    <li className="tarefa">
      <span>{tarefa.texto}</span>
    </li>
  );
}

export default Tarefa;
```

As chaves no parâmetro pegam direto a prop `tarefa` de dentro do objeto de props, e por isso lá embaixo escrevemos só `tarefa.texto`, sem o `props.` na frente. As duas formas fazem exatamente a mesma coisa. Vamos adotar essa segunda forma daqui para frente, porque é a mais comum e deixa o código mais curto. Atualize o seu `Tarefa.jsx` para essa versão.

---

## Etapa 3: o estado e o formulário para adicionar tarefas

Objetivo: deixar o usuário digitar e adicionar uma tarefa. Aqui aparece o conceito mais importante do React, o **estado** com o hook `useState`, além dos eventos `onClick` e `onChange` e dos campos controlados.

Até agora as tarefas estão fixas numa `const`. O problema é que, no React, uma variável comum não faz a tela atualizar quando muda. Se você der um `push` nesse array, o React nem fica sabendo, e a tela continua igual. Para que uma mudança de dados redesenhe a tela, esse dado precisa morar no **estado** do componente.

O estado é criado com uma ferramenta do React chamada `useState`, que é o nosso primeiro **hook**. Hooks são funções especiais do React cujo nome começa com `use`. Vamos transformar a lista de tarefas em estado e criar também um estado para o texto que está sendo digitado.

Reescreva o `src/App.jsx` assim:

```jsx
import { useState } from "react";
import Tarefa from "./Tarefa.jsx";

function App() {
  const [tarefas, setTarefas] = useState([
    { id: 1, texto: "Estudar React", concluida: false },
    { id: 2, texto: "Entender componentes", concluida: true },
    { id: 3, texto: "Praticar JSX", concluida: false }
  ]);

  const [texto, setTexto] = useState("");

  function adicionarTarefa() {
    const textoLimpo = texto.trim();

    if (textoLimpo === "") {
      return;
    }

    const novaTarefa = {
      id: Date.now(),
      texto: textoLimpo,
      concluida: false
    };

    setTarefas([...tarefas, novaTarefa]);
    setTexto("");
  }

  return (
    <main className="app">
      <h1>Minhas Tarefas</h1>

      <div className="entrada">
        <input
          type="text"
          placeholder="Escreva uma tarefa"
          value={texto}
          onChange={function (e) {
            setTexto(e.target.value);
          }}
        />
        <button onClick={adicionarTarefa}>Adicionar</button>
      </div>

      <ul>
        {tarefas.map(function (tarefa) {
          return <Tarefa key={tarefa.id} tarefa={tarefa} />;
        })}
      </ul>
    </main>
  );
}

export default App;
```

Salve e teste: digite uma tarefa e clique em Adicionar. Ela aparece na lista, e o campo se limpa sozinho.

Sobre o `useState`:

- `import { useState } from "react"` traz o hook para o arquivo. As chaves aqui são do `import`, e indicam que estamos pegando um item específico de dentro da biblioteca React.
- `const [tarefas, setTarefas] = useState(...)` cria um estado. O `useState` recebe o **valor inicial** (aqui, o array de três tarefas) e devolve duas coisas dentro de um array: o valor atual do estado, que chamamos de `tarefas`, e uma função para mudar esse valor, que chamamos de `setTarefas`. Essa forma de escrever, pegando dois valores de um array de uma vez, se chama desestruturação, a mesma ideia das chaves que usamos nas props.
- A regra de ouro é esta: **nunca altere o estado diretamente**, sempre use a função `set`. Em vez de `tarefas.push(...)`, chamamos `setTarefas(...)`. É essa função que avisa o React de que o dado mudou e que a tela precisa ser redesenhada. Mudar o array na mão não dispara o redesenho, e a tela fica desatualizada.
- Note que temos um segundo estado, `texto`, com valor inicial de string vazia. Ele guarda o que está escrito no campo a cada instante.

Sobre o campo controlado e o `onChange`:

- No `<input>`, repare em duas props. A `value={texto}` faz o campo sempre mostrar exatamente o que está no estado `texto`. E `onChange` registra uma função que roda toda vez que o usuário digita. Essa função recebe o objeto de evento `e`, lê o que foi digitado com `e.target.value` e atualiza o estado com `setTexto`.
- Isso forma um ciclo: o usuário digita, o `onChange` atualiza o estado, o estado novo volta para o `value` do campo, e a tela mostra a letra nova. Como o estado manda no que aparece no campo, dizemos que ele é um **campo controlado**: o estado é a fonte da verdade, e não o campo HTML. É por isso que, ao chamar `setTexto("")` no fim de `adicionarTarefa`, o campo se limpa sozinho, sem precisarmos mexer no elemento diretamente.
- Compare com a versão de JavaScript, em que você lia `campoTarefa.value` e escrevia `campoTarefa.value = ""` para limpar. No React você nunca toca no campo diretamente, você só mexe no estado, e o campo acompanha.

Sobre o `onClick` e como adicionamos a tarefa:

- No botão, `onClick={adicionarTarefa}` liga o clique à função, do mesmo jeito que o `addEventListener` fazia. Repare que passamos `adicionarTarefa` sem os parênteses, porque estamos entregando a função para o React chamar no clique, e não executando-a agora. Se escrevêssemos `adicionarTarefa()`, ela rodaria na hora de desenhar, o que está errado.
- Dentro de `adicionarTarefa`, a validação `if (textoLimpo === "")` com `return` é a mesma de antes: barra tarefas vazias. O objeto da nova tarefa também é igual, com `Date.now()` gerando um `id` único.
- A linha mais importante é `setTarefas([...tarefas, novaTarefa])`. Aqueles três pontos `...` se chamam **espalhamento** (spread). Eles copiam todos os itens do array `tarefas` atual para dentro de um array novo, e logo depois acrescentamos a `novaTarefa`. Ou seja, criamos um array novo formado pelas tarefas antigas mais a nova, e entregamos esse array novo ao `setTarefas`.
- Por que não usar o `push`? Porque o `push` altera o array existente, e no React a regra é não modificar o estado diretamente, e sim substituí-lo por um novo. Sempre que mudar uma lista que está no estado, o caminho é criar uma lista nova com a alteração e passá-la para a função `set`. Isso vai se repetir nas próximas etapas.

Para permitir adicionar com a tecla Enter, como no projeto anterior, acrescente a prop `onKeyDown` ao input:

```jsx
<input
  type="text"
  placeholder="Escreva uma tarefa"
  value={texto}
  onChange={function (e) {
    setTexto(e.target.value);
  }}
  onKeyDown={function (e) {
    if (e.key === "Enter") {
      adicionarTarefa();
    }
  }}
/>
```

A ideia é a mesma de antes: o evento traz `e.key`, e quando for `"Enter"` chamamos a mesma função de adicionar, reaproveitando a lógica.

---

## Etapa 4: concluir e remover tarefas

Objetivo: marcar uma tarefa como concluída ao clicar nela e removê-la com um botão. Aqui aprofundamos o estado, a renderização condicional de classes e o repasse de funções para os componentes filhos via props.

Repare numa diferença em relação ao projeto antigo. Lá, as funções de concluir e remover mexiam direto no array global. Aqui, quem é dono da lista de tarefas é o `App`, porque é nele que mora o estado. Mas quem precisa disparar a ação é o componente `Tarefa`, lá embaixo. Como o filho avisa o pai de que algo deve mudar? Passando uma função como prop. O pai entrega ao filho funções como "alternar conclusão" e "remover", e o filho as chama quando o usuário clica.

Primeiro, crie no `App` as duas funções e passe-as para cada `Tarefa`:

```jsx
function alternarConclusao(id) {
  setTarefas(
    tarefas.map(function (tarefa) {
      if (tarefa.id === id) {
        return { ...tarefa, concluida: !tarefa.concluida };
      }
      return tarefa;
    })
  );
}

function removerTarefa(id) {
  setTarefas(
    tarefas.filter(function (tarefa) {
      return tarefa.id !== id;
    })
  );
}
```

Agora, no `map` que desenha as tarefas, passe essas funções como props:

```jsx
<ul>
  {tarefas.map(function (tarefa) {
    return (
      <Tarefa
        key={tarefa.id}
        tarefa={tarefa}
        aoAlternar={alternarConclusao}
        aoRemover={removerTarefa}
      />
    );
  })}
</ul>
```

E reescreva o `src/Tarefa.jsx` para usar essas funções e mostrar o estado de concluída:

```jsx
function Tarefa({ tarefa, aoAlternar, aoRemover }) {
  const classe = tarefa.concluida ? "tarefa concluida" : "tarefa";

  return (
    <li className={classe}>
      <span onClick={function () {
        aoAlternar(tarefa.id);
      }}>
        {tarefa.texto}
      </span>

      <button className="remover" onClick={function () {
        aoRemover(tarefa.id);
      }}>
        Remover
      </button>
    </li>
  );
}

export default Tarefa;
```

Salve e teste: clique no texto de uma tarefa para riscá-la, clique de novo para desmarcar, e clique em Remover para apagá-la.

Sobre os comandos:

- Em `alternarConclusao`, usamos `tarefas.map` para criar um array novo. Para cada tarefa, se o `id` for o que procuramos, devolvemos uma **cópia** dela com o `concluida` invertido: `{ ...tarefa, concluida: !tarefa.concluida }`. O spread copia todas as propriedades da tarefa, e logo em seguida sobrescrevemos só o `concluida`. Para as demais tarefas, devolvemos elas mesmas, sem mudança. O resultado é uma lista nova, igual à anterior, exceto pela tarefa que foi alternada. Esse array novo vai para o `setTarefas`, e o React redesenha.
- Veja o padrão se repetindo: em vez de achar a tarefa e mexer nela no lugar, criamos uma lista nova com a alteração. No projeto de JavaScript usávamos `find` e mudávamos o objeto direto; no React preferimos `map` devolvendo cópias, para não alterar o estado existente.
- Em `removerTarefa`, o `filter` é igual ao de antes: mantém só as tarefas cujo `id` é diferente do que queremos tirar, gerando uma lista nova sem aquele item. Como o `filter` já devolve um array novo, ele combina perfeitamente com a regra do React. O resultado vai direto para o `setTarefas`.
- No `Tarefa`, recebemos agora três props entre chaves: a `tarefa` e as duas funções, `aoAlternar` e `aoRemover`. Os nomes das props são escolha nossa; usamos "ao" para deixar claro que são ações que acontecem em resposta a algo.
- A linha `const classe = tarefa.concluida ? "tarefa concluida" : "tarefa"` é uma **renderização condicional** usando o operador ternário. Ele funciona assim: `condição ? valorSeVerdadeiro : valorSeFalso`. Se a tarefa está concluída, a classe vira `"tarefa concluida"`, senão fica só `"tarefa"`. Depois colocamos esse valor em `className={classe}`. É o equivalente, em React, àquele `classList.add("concluida")` condicional que você fazia antes: aqui você descreve qual classe o elemento deve ter conforme os dados, e o React aplica.
- Nos eventos, `onClick` no `span` e no botão chama as funções recebidas, passando o `id` da tarefa. Repare que escrevemos `onClick={function () { aoAlternar(tarefa.id); }}`. Precisamos embrulhar a chamada em uma função porque queremos passar o `tarefa.id`. Se escrevêssemos `onClick={aoAlternar(tarefa.id)}`, a função rodaria na hora de desenhar, e não no clique. Por isso entregamos uma função que, quando chamada, executa a ação com o id certo.

Note o desenho que se formou: o estado vive no `App`, as funções que mudam o estado também, e os componentes `Tarefa` apenas mostram os dados e avisam o pai quando o usuário faz algo. Esse fluxo, dados descendo por props e avisos subindo por funções, é a espinha dorsal de qualquer aplicação React.

---

## Etapa 5: filtrar e contar

Objetivo: mostrar só as pendentes, só as concluídas ou todas, exibir quantas faltam e dar uma mensagem quando a lista estiver vazia. Aqui usamos mais estado, renderização condicional e calculamos valores a partir do estado.

Vamos guardar em um estado qual filtro está ativo, e a partir dele decidir quais tarefas exibir. Acrescente um novo estado no `App`:

```jsx
const [filtro, setFiltro] = useState("todas");
```

Logo antes do `return`, calcule a lista filtrada e o número de pendentes. Repare que isso é só JavaScript comum, rodando a cada vez que o componente desenha:

```jsx
const tarefasFiltradas = tarefas.filter(function (tarefa) {
  if (filtro === "pendentes") {
    return tarefa.concluida === false;
  }
  if (filtro === "concluidas") {
    return tarefa.concluida === true;
  }
  return true;
});

const pendentes = tarefas.filter(function (tarefa) {
  return tarefa.concluida === false;
});
```

Agora, no `return`, acrescente os botões de filtro logo abaixo do `<div className="entrada">`, troque o `map` para percorrer `tarefasFiltradas`, e adicione o contador e a mensagem de lista vazia. Esta é a aparência do `return` completo:

```jsx
return (
  <main className="app">
    <h1>Minhas Tarefas</h1>

    <div className="entrada">
      <input
        type="text"
        placeholder="Escreva uma tarefa"
        value={texto}
        onChange={function (e) {
          setTexto(e.target.value);
        }}
        onKeyDown={function (e) {
          if (e.key === "Enter") {
            adicionarTarefa();
          }
        }}
      />
      <button onClick={adicionarTarefa}>Adicionar</button>
    </div>

    <div className="filtros">
      <button
        className={filtro === "todas" ? "filtro ativo" : "filtro"}
        onClick={function () {
          setFiltro("todas");
        }}
      >
        Todas
      </button>
      <button
        className={filtro === "pendentes" ? "filtro ativo" : "filtro"}
        onClick={function () {
          setFiltro("pendentes");
        }}
      >
        Pendentes
      </button>
      <button
        className={filtro === "concluidas" ? "filtro ativo" : "filtro"}
        onClick={function () {
          setFiltro("concluidas");
        }}
      >
        Concluídas
      </button>
    </div>

    <ul>
      {tarefasFiltradas.map(function (tarefa) {
        return (
          <Tarefa
            key={tarefa.id}
            tarefa={tarefa}
            aoAlternar={alternarConclusao}
            aoRemover={removerTarefa}
          />
        );
      })}
    </ul>

    {tarefasFiltradas.length === 0 && (
      <p className="vazio">Nenhuma tarefa por aqui.</p>
    )}

    <p className="contador">Tarefas pendentes: {pendentes.length}</p>
  </main>
);
```

Salve e teste: adicione tarefas, marque algumas como concluídas e troque entre os filtros. O contador acompanha o número de pendentes, e a mensagem de vazio aparece quando nenhuma tarefa se encaixa no filtro.

Sobre os comandos:

- O estado `filtro` guarda qual botão está ativo, começando em `"todas"`. Cada botão de filtro, no `onClick`, chama `setFiltro` com o seu valor, o que muda o estado e faz o React redesenhar com a nova escolha.
- `tarefasFiltradas` é calculado a cada renderização a partir do estado. Não é um estado novo, é um valor **derivado** do estado que já temos. Esse é um ponto importante: quando uma informação pode ser calculada a partir do que você já guarda, calcule-a, não a guarde em um estado separado. Aqui, a lista filtrada sai de `tarefas` mais `filtro`, então não precisa de estado próprio.
- O `filter` que monta `tarefasFiltradas` faz o mesmo papel da função `tarefasFiltradas` do projeto antigo, escolhendo o que mostrar conforme o filtro. O mesmo vale para `pendentes`, que conta quantas faltam.
- Nos botões de filtro, a classe sai de um ternário: `filtro === "pendentes" ? "filtro ativo" : "filtro"`. O botão que corresponde ao filtro atual recebe a classe `ativo` e fica destacado pelo CSS. Compare com a versão antiga, em que você removia a classe de todos e adicionava no clicado, na mão. Aqui você só descreve "o botão ativo é o que bate com o filtro atual", e o React cuida de aplicar.
- A linha `{tarefasFiltradas.length === 0 && (<p ...>)}` é uma renderização condicional muito comum no React. O `&&` funciona assim: se o que está à esquerda for verdadeiro, o que está à direita aparece; se for falso, nada aparece. Então, quando a lista filtrada tem zero itens, a mensagem surge; quando tem itens, ela some. É a forma do React de mostrar ou esconder um pedaço de tela conforme uma condição.
- O contador é só `{pendentes.length}` dentro do texto. Como `pendentes` é recalculado a cada desenho, o número sempre reflete o estado atual, sem precisarmos atualizar um elemento na mão como fazíamos com `textContent`.

---

## Etapa 6: salvar as tarefas no navegador

Objetivo: fazer as tarefas continuarem lá depois de recarregar a página. Aqui entra o hook `useEffect`, combinado com o `localStorage` e a dupla `JSON.stringify` e `JSON.parse` que você já conhece.

Hoje, ao recarregar a página, as tarefas voltam para a lista inicial, porque o estado nasce de novo a cada carregamento. Queremos salvar as tarefas no `localStorage` sempre que elas mudarem, e carregá-las de volta quando a aplicação começar. O `localStorage` é o mesmo de antes, só guarda texto, então continuamos usando `JSON.stringify` para salvar e `JSON.parse` para ler.

A novidade é **quando** rodar esse código. Salvar no `localStorage` é um "efeito colateral": não é desenhar a tela, é uma ação que acontece por causa de uma mudança. Para isso o React tem o hook `useEffect`, que executa um código depois que a tela é desenhada, e permite dizer em resposta a quais mudanças ele deve rodar.

Primeiro, faça o estado inicial das tarefas vir do `localStorage`. Troque a criação do estado `tarefas` por esta versão, que lê o que estiver salvo:

```jsx
const [tarefas, setTarefas] = useState(function () {
  const dados = localStorage.getItem("tarefas");
  if (dados) {
    return JSON.parse(dados);
  }
  return [];
});
```

Agora importe o `useEffect` junto do `useState` no topo do arquivo:

```jsx
import { useState, useEffect } from "react";
```

E acrescente o efeito que salva, logo após a criação dos estados:

```jsx
useEffect(function () {
  localStorage.setItem("tarefas", JSON.stringify(tarefas));
}, [tarefas]);
```

Salve e teste: adicione algumas tarefas, recarregue a página e confira se elas continuam lá.

Sobre os comandos:

- O valor inicial do `useState` pode ser uma função, e não só um valor pronto. Quando passamos uma função, o React a executa **uma única vez**, na primeira vez que o componente aparece, e usa o que ela retornar como estado inicial. Usamos isso para ler o `localStorage` só na partida: se houver dados salvos, devolvemos o array já convertido com `JSON.parse`; senão, devolvemos um array vazio. É o equivalente à função `carregar` do projeto antigo, mas embutido na criação do estado.
- O `useEffect` recebe duas coisas: uma função com o que deve ser feito, e um array no fim, chamado de lista de dependências. A função aqui salva as tarefas no `localStorage`, convertendo o array em texto com `JSON.stringify`, exatamente como a função `salvar` de antes.
- O array `[tarefas]` no fim é a peça-chave. Ele diz ao React: "rode este efeito sempre que `tarefas` mudar". Assim, toda vez que adicionamos, removemos ou alternamos uma tarefa, o estado muda, o React redesenha e em seguida roda o efeito, que salva a lista atualizada. No projeto de JavaScript você tinha que lembrar de chamar `salvar()` dentro de cada uma das três funções que mexiam na lista. Aqui, um único `useEffect` cuida de todas, porque ele observa o estado e dispara sozinho quando ele muda. Menos repetição e menos chance de esquecer.
- Se o array de dependências fosse `[]` vazio, o efeito rodaria só uma vez, na partida. Se você não passar array nenhum, ele roda depois de todo desenho. Como queremos salvar a cada mudança da lista, listamos `tarefas` como a dependência. Entender esse array é entender o `useEffect`.

---

## Boas práticas que aparecem no projeto

Vale recolher, em um só lugar, as decisões de qualidade que o React nos levou a tomar, porque elas valem para qualquer projeto daqui para frente.

Quebrar a interface em componentes pequenos, cada um com a sua responsabilidade, é a mesma ideia de quebrar o programa em funções pequenas, agora aplicada à tela. O componente `Tarefa` sabe se desenhar e avisar o pai, e o `App` cuida dos dados. Manter o estado o mais perto possível de quem precisa dele, e quando vários componentes dependem do mesmo dado, guardá-lo no pai comum e passá-lo por props, mantém o fluxo de dados claro: dados descem por props, avisos sobem por funções. Nunca alterar o estado diretamente, sempre criar um valor novo e usar a função `set`, é o que garante que a tela acompanhe os dados. Calcular valores derivados, como a lista filtrada e a contagem de pendentes, em vez de guardá-los em estados separados, evita que duas informações fiquem fora de sincronia. E descrever a tela de forma declarativa, dizendo como ela deve ser para cada estado em vez de mexer no HTML na mão, é a virada de chave que o React traz em relação ao JavaScript puro.

## Um passo adiante: as arrow functions

Você viu, no roteiro de JavaScript, a forma mais curta de escrever funções, com uma seta no lugar da palavra `function`. No mundo React essa forma é tão comum que praticamente todo código que você encontrar a usa. Por exemplo, este trecho que escrevemos:

```jsx
{tarefas.map(function (tarefa) {
  return <Tarefa key={tarefa.id} tarefa={tarefa} />;
})}
```

costuma aparecer assim:

```jsx
{tarefas.map((tarefa) => (
  <Tarefa key={tarefa.id} tarefa={tarefa} />
))}
```

E um evento como este:

```jsx
onClick={function () {
  aoRemover(tarefa.id);
}}
```

vira:

```jsx
onClick={() => aoRemover(tarefa.id)}
```

As duas formas fazem a mesma coisa. Mantivemos `function` por extenso ao longo do roteiro para deixar visível o que acontece, já que é o primeiro contato de vocês com o React. Quando estiver mais confortável, vale reescrever o projeto inteiro com arrow functions, porque é o que você vai ver em qualquer material e projeto real.

## Desafios para praticar

1. Criar um componente `Filtros` separado, que receba o filtro atual e a função de mudar filtro por props, deixando o `App` mais enxuto.
2. Não deixar adicionar uma tarefa repetida, conferindo no array antes de inserir.
3. Permitir editar o texto de uma tarefa, usando um estado para controlar qual tarefa está em edição.
4. Acrescentar um botão para limpar todas as tarefas concluídas de uma vez.
5. Criar um componente `Contador` que receba o número de pendentes por prop.
6. Mostrar o total de tarefas e o total de concluídas, ambos calculados a partir do estado.

## Resumo dos conceitos

Reaproveitados do JavaScript: arrays e arrays de objetos, os métodos `map`, `filter` e `find`, igualdade estrita com `===`, funções que retornam valor, o objeto de evento e o `e.key`, o operador ternário, e a persistência com `localStorage`, `JSON.stringify` e `JSON.parse`.

Novos do React: componentes como funções que devolvem JSX, JSX com `{ }` e `className`, props para passar dados do pai para o filho, estado com `useState`, a regra de nunca alterar o estado diretamente e sempre usar a função `set`, renderização de listas com `map` e a `key`, eventos com `onClick`, `onChange` e `onKeyDown`, campos controlados com `value` e `onChange`, renderização condicional com o ternário e com o `&&`, valores derivados calculados a cada desenho, e efeitos colaterais com `useEffect` e sua lista de dependências.

A ideia que costura tudo: no React você descreve a tela de forma declarativa a partir do estado, os dados descem por props e os avisos sobem por funções, e quando o estado muda o React redesenha sozinho a parte certa da tela. O `exibirTarefas` que você atualizava na mão a cada etapa do projeto anterior some, porque agora é o React quem mantém a tela em dia com os dados.

## Referências

- React, documentação oficial (em português): https://pt-br.react.dev/
- React, Pensando em React: https://pt-br.react.dev/learn/thinking-in-react
- React, useState: https://pt-br.react.dev/reference/react/useState
- React, useEffect: https://pt-br.react.dev/reference/react/useEffect
- React, renderizando listas: https://pt-br.react.dev/learn/rendering-lists
- Vite, guia de início: https://vitejs.dev/guide/
