
# Como utilizar o Validators

A classe validators é chamada pela função validate que recebe dois argumentos

``data`` - do tipo Array de objetos;

``validates`` - do tipo IValidates.

a interface IValidates recebe dois argumentos possiveis, sendo um requerido

``validator`` - recebe uma ``string`` ou uma ``array`` contendo as validações

``messages (opcional)`` - recebe um ``objeto`` contendo ``chave`` (``nome do campo``) e ``valor``

Validações:

``string`` - Verifica se o campo é uma string

``number`` - Verifica se o campo é um numero

``array`` - Verifica se o campo é uma array

``object`` - Verifica se o campo é um objeto

``N>(numero)`` - Verifica se o valor é maior que (numero)
para utilizar esta validação você colocará desta maneira: N>10, ou N>50,
depois do N> vem o numero da validação, se o campo for numero, ele irá verificar
se o numero é maior que o informado, caso for string, ele irá verificar se a string contém
mais caracteres que o numero informado.

``N<(numero)`` - Mesma funcionalidade da validação anterior, somente muda a verificação para ``menor que``

``required`` - Verifica se o campo existe


Mensagens de erro:

Na função ``valideMessages`` contém as mensagens padrões para cada tipo de validação, todavia
é opcional caso queira modificar estas mensagens, utilizando o argumento messages, quando for chamar a função ``validate``

Para utilizar uma mensagem opcional, é necessario informar no objeto o nome do campo validado, e o erro, ex:

``messages: {
    password: {
    "N>10": "O campo password precisa conter mais que 10 numeros",
    "number": "O campo precisa ser do tipo numero"
}
}``

Caso queira mostrar o valor encontrado, e o nome da validação, basta passar
a chave ``{name}`` para mostrar o nome do campo validado e ``{value}`` para o
valor validado.


Customizando exibição do erro:

No segundo argumento passado ao ``validate``, passe dentro do objeto ``errorProvider``,
errorProvider é do tipo função, que deverá receber o argumento ``error`` do tipo string,
e dentro desta função você poderá exibir em toasts customizados por você, alertas, e etc.

Deixo abaixo um exemplo de validação:

 

## Uso/Exemplos

```javascript
const valide = new Validators();
const validated = valide.validate(
  [
    {
      data: 60,
      teste: 1,
    },
  ],
  {
    validator: {
      data: ["number", "N>10", "N<50"],
      teste: "string",
    },
    messages: {
      data: {
        "number": "Este dado precisa ser um numero",
        "N>10": "Este dado precisa ser maior que 10",
      },
      teste: "Este dado precisa ser uma frase indiana"
    },
    errorProvider: (error: any) => message.error(error) //toast antd
  }
);


result: event - message.error("This value of field data needs must be less than 50")
result: event - message.error("Este dado precisa ser uma frase indiana")
```

