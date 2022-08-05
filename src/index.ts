import express, { Express } from "express";

const env = "dev";
// design e arquitetura

// SOLID => um conjunto de regras de como o seu código deve se comportar
// discipline => aplicando uma disciplina => uma restrição

// estrutura de dados; comportamento; estrutura de dados + comportamento
// { name: 'Pessini', idade: 31 }
// sayHello() { console.log('Hello'); }
// struct = {  } => OO { name: 'Pessini', sayHello(to){ console.log(`Olá ${to}`) } }

// single responsability = funções, classes/objetos, estruturas de dados

// open to extensions and closed to modifications.
// exemplo: Herança ClassePai Aberta para extensão mas NÃO PODE SER MODIFICADA
class Exemplo1Logger {
  // <= classe pai
  constructor(public message: string) {}
  log(): string {
    console.log(this.message);
    return this.message;
  }
}
// surgiu a necessidade de um log error
class Exemplo1LoggerElasticStack extends Exemplo1Logger {
  // <= classe filha extende o comportamento da classe pai
  constructor(message: string) {
    super(`${new Date().toISOString()}-${message}`);
  }
  log(): string {
    console.log("salvar no banco de dados", this.message);
    return this.message;
  }
}

// liskov substitution
// sempre a classe mais específica deve poder ser substituida pela mais genérica

// interface segregation

// o contrato aqui é ter uma função log
//LoggerInterface
interface ILogger {
  //código abstrato
  log(): string;
}

class Exemplo2Logger implements ILogger {
  // código concreto pq eu tenho implementação
  // <= classe pai
  constructor(public message: string) {}
  log(): string {
    console.log(this.message);
    return this.message;
  }
}
// surgiu a necessidade de um log error
class Exemplo2LoggerElasticStack implements ILogger {
  // <= classe filha extende o comportamento da classe pai
  constructor(public message: string) {
    this.message = `${new Date().toISOString()}-${message}`;
  }
  log(): string {
    console.log("salvar no banco de dados", this.message);
    return this.message;
  }
}

// dependency inversion

function sayHelloEaseMode(): string {
  //possuo a dependencia
  const logger = new Exemplo1Logger("minha mensagem");

  const message = logger.log();
  return `Finanlizando com a mensagem: ${message}`;
}

// inversão da dependencia: eu delego a escolha para quem me chama
function sayHello(logger: ILogger): string {
  const message = logger.log();
  return `Finanlizando com a mensagem: ${message}`;
}

// config
// bootstrap
// ioc -> Inversion of control -> camada de injeção de dependencias

// MVC => req -> controller/action -> model -> controller/action -> view -> res
// cada rota é mapeada apenas para 1 action
// no model cada função faz apenas 1 ação. CRUD
// o view é responsável apenas por dados de resposta para o usuario. Ex: json; html+css+js
// o controller indica qual Model ele quer usar, mas não instancia

// constructor e super: herança
class Pai {
  constructor(public name: string = "xxx") {
    this.name = name;
  }

  sayFamilyName() {
    return "Brasões Vieira";
  }
  sayWhat() {
    return `${this.name} ${this.sayFamilyName()}`;
  }
}

class Filho extends Pai {
  constructor(
    public name: string,
    public mother: string,
    public familyMothersName: string
  ) {
    super(name);
  }

  sayWhat() {
    const nameWithFather = super.sayWhat();
    return `${nameWithFather} ${this.familyMothersName}`;
  }
}

//
console.log("-------------------");
console.log(new Pai("Marcelo").sayWhat());
console.log("-------------------");

console.log("-------------------");
console.log(new Filho("João", "Maria", "Silva").sayWhat());
console.log("-------------------");

// roteamento
const app: Express = express();

// HTTP [GET, POST, PUT, DELETE]
app.get("/", (req, res) => {
  let exemplo1LogMessage: Exemplo1Logger;
  if (env != "dev") {
    exemplo1LogMessage = new Exemplo1Logger("Pessinistro mesmo!");
  } else {
    exemplo1LogMessage = new Exemplo1LoggerElasticStack(
      "Cuidado que o omi é brabo!"
    );
  }

  let exemplo2LogMessage: Exemplo2Logger;
  if (env != "dev") {
    exemplo2LogMessage = new Exemplo2Logger("Pessinistro mesmo!");
  } else {
    exemplo2LogMessage = new Exemplo2LoggerElasticStack(
      "Cuidado que o omi é brabo!"
    );
  }

  // Logger é Logger e foda-se

  res.json({
    message: exemplo1LogMessage.log(),
    messageToMyDaughter: exemplo1LogMessage.log(),
    exemplo1: {
      ehLogger: exemplo1LogMessage instanceof Exemplo1Logger,
      ehLoggerAinda: exemplo1LogMessage instanceof Exemplo1LoggerElasticStack,

      sayHello: sayHello(exemplo1LogMessage),
    },
    exemplo2: {
      ehLogger: exemplo2LogMessage instanceof Exemplo2Logger,
      ehLoggerAinda: exemplo2LogMessage instanceof Exemplo2LoggerElasticStack,

      ehILogger: !!exemplo2LogMessage.log(),
      ehILoggerAinda: !!exemplo2LogMessage.log(),

      sayHello: sayHello(exemplo2LogMessage),
    },
  });
});

app.get("/health-check", (req, res) => {
  res.json({
    status: "up",
  });
});

app.listen(3000, () => {
  console.log("Já subi um serve pq nóis é foda!");
});
