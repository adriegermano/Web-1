function App(){
  const tarefas = [
    {id: 1, texto: "Estudar React", concluida: false},
    {id: 2, texto: "Entender componentes", concluida: true},
    {id: 3, texto: "Praticar JSX", concluida: false}
  ];

  return (
    <main className="app">
      <h1>Minhas Tarefas</h1>

      <ul>
        {tarefas.map(function (tarefa){
          return(
            <li className="tarefa" key={tarefa.id}>
              <span>{tarefa.texto}</span>
            </li>
          )
        })}
      </ul>
    </main>
  );
}

export default App;

// () - Parâmetros
// {} - Escopo
// .map - Mapeia a estrutura
// span - Espaçamento objetivo