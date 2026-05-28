
const pessoa = [{
    /*Criei uma constante com nome de pessoa que vai receber o objeto {}*/
    nome: "Adriel",
    idade: 18,
    email: ["adrielgermano@unipam.edu.br", " adriel1234@gmail.com"],
    altura: 1.67,

},

{
    nome: "Carlinhos",
    idade: 20,
    email: ["carlos@unipam.edu.br", " carlao1234@gmail.com"],
    altura: 1.77,
},
]

console.log(`Nome: ${pessoa[0].nome}`);
console.log(`Idade: ${pessoa[1].idade}`);
console.log(`Email(s): ${pessoa[0].email[0]}`); /*Tá chamando só o elemento 0 da lista email*/
console.log(`Altura: ${pessoa[1].altura}`);
console.log(`Pessoa: ${pessoa[0].nome}`);
console.log(`Pessoa: ${pessoa[1].nome}`);


/*
() - Função
{} - Objeto ou Escopo de Estrutura
[] - Lista
*/