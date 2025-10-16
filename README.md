# MyFI - Financial Simulation API / API de Simulação Financeira

![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)

<p>
  (en-US)<br>
  MyFI is a simplified API simulating the services of a financial institution (FI), allowing the management of customers, accounts, and transactions in a standardized way. Each instance operates as an independent bank and can be integrated with other projects, simulating an Open Finance environment.
</p>
<p>
  (pt-Br)<br>
  <em>MyFI é uma API simplificada que simula os serviços de uma instituição financeira (IF), permitindo gerenciar clientes, contas e transações de forma padronizada. Cada instância funciona como um banco independente e pode ser integrada a outros projetos, simulando um ambiente de Open Finance.</em>
</p>

---

## 📌 Table of Contents / Tabela de Conteúdos

* [Features / Funcionalidades](#-features--funcionalidades)
* [Technologies Used / Tecnologias Utilizadas](#-technologies-used--tecnologias-utilizadas)
* [Project Structure / Estrutura do Projeto](#-project-structure--estrutura-do-projeto)
* [Getting Started / Como Começar](#-getting-started--como-começar)
* [API Endpoints / Como Utilizar a API](#-api-endpoints--como-utilizar-a-api)
* [Next Steps / Próximos Passos](#-next-steps--próximos-passos)
* [License / Licença](#-license--licença)
* [Author / Autor](#-author--autor)

---

## ✨ Features / Funcionalidades

* **Customer Creation** / *Criação de clientes* 
* **Account Creation** / *Criação de contas vinculadas a um cliente* 
* **Balance Inquiry** / *Consulta de saldo* 
* **Transaction Processing** (Credit & Debit) / *Realização de transações (crédito e débito)* 
* **Fund Transfers** / *Transferência de fundos entre contas* 
* **Transaction History** (Statement) / *Listagem de transações por conta (extrato)* 

---

## 💻 Technologies Used / Tecnologias Utilizadas

* **Node.js**: JavaScript runtime environment
* **Express.js**: RESTful framework
* **MongoDB**: NoSQL Database
* **Mongoose**: ODM for MongoDB interaction
* **Dotenv**: Environment variables manager

---

## 📁 Project Structure / Estrutura do Projeto
```
MyFI/
├── src/
|   ├── config/
│   │   └── database.js
|   |  
|   ├── controllers/
│   │   ├── accountController.js
│   │   ├── customerController.js
│   │   └── transactionController.js
|   |  
|   ├── models/
│   │   ├── Account.js
│   │   ├── Customer.js
│   │   └── Transaction.js
|   |  
│   ├── routes/
│   │   ├── accountRoutes.js
│   │   ├── customerRoutes.js
│   │   └── transactionRoutes.js
|   |  
│   └── utils/
│       └── idGenerator.js
│       └── cpfValidator.js
|
├── .env
├── .gitignore
├── index.js
├── server.js
└── package.json
```
---

## 🚀 Getting Started / Como Começar

### **Prerequisites / Pré-requisitos**

* Node.js (v18 or higher)
* MongoDB (local instance or connection URI)

### **Installation / Instalação**

1.  **Clone the repository / Clone o repositório:**
    ```bash
    git clone [https://github.com/g-fe-p-b/MyFI.git](https://github.com/g-fe-p-b/MyFI.git)
    cd MyFI
    ```

2.  **Install dependencies / Instale as dependências:**
    ```bash
    npm init
    npm install express mongodb
    ```

3.  **Set up environment variables / Configure as variáveis de ambiente:**
    Create a `.env` file in the root directory using `example.env` as a reference.
    ```ini
    PORT=3000
    MONGO_URI=mongodb://localhost:27017/myFIdatabase
    TIMEZONE=America/Sao_Paulo
    ```

### **Running the Application / Executando a Aplicação**

Run in development mode with `nodemon` / *Execute em modo de desenvolvimento com `nodemon`*:
```bash
npm run dev
```
The server will be available at ```http://localhost:3000.```


## 📡 API Endpoints / Como Utilizar a API
All API responses are in JSON format. Dates must follow the ISO 8601 (YYYY-MM-DD) standard. 

👤 Customers / Clientes
```

┌--------┯------------------------┯------------------------------------------------┯----------------------------------------------------------------------------------------------------------------------┓
| Method | Endpoint               | Description                                    | Server status                                                                                                        |
╞========╪========================╪================================================╪======================================================================================================================╡
| POST   | /customers             | Creates a new customer /                       | (201), "Costumer created successfuly" || (400), "fill all the fields with valid values", "Type a valid CPF" ||       |
|        |                        | Cria um novo cliente                           | (409), "This email already exists in the system.", "This CPF already exists in the system." || (500), "Server error" |
┣--------╋------------------------╋------------------------------------------------╋----------------------------------------------------------------------------------------------------------------------┫
| GET    | /customers             | Gets a list with all customers /               | (200), Returns a list of all costumers || (500), "Server error"                                                      |
|        |                        | Retorna uma lista com todos os clientes        |                                                                                                                      |
┣--------╋------------------------╋------------------------------------------------╋----------------------------------------------------------------------------------------------------------------------┫
| GET    | /customers/:customerId | Gets all the information of a customer /       | (200), Returns all information of a costumer || (404), "Costumer not found" || (500), "Server error"                 |
|        |                        | Retorna todas as informações de um cliente     |                                                                                                                      |
┣--------╋------------------------╋------------------------------------------------╋----------------------------------------------------------------------------------------------------------------------┫
| DELETE | /customers             | Delete a costumer /                            | (200), "Costumer deleted successfuly" || (404), "Costumer not found" || (500), "Server error"                        |
|        |                        | Deleta um cliente                              |                                                                                                                      |
┕--------┷------------------------┷------------------------------------------------┷----------------------------------------------------------------------------------------------------------------------┙

```

Body Example:
```
json
{
  "name": "Philip K. D.",
  "cpf": "12345678900",
  "email": "pkd@email.com"
}
```


🏦 Accounts / Contas
````
┌--------┯-------------------------------┯------------------------------------------------------┯-----------------------------------------------------------------------------------------------------------------------------------┓
| Method | Endpoint                      | Description                                          | Server status                                                                                                                     |
╞========╪===============================╪======================================================╪===================================================================================================================================╡
| POST   | /accounts/new                 | Creates a new account for a customer /               | (201), "Account created successfuly" || (400), "fill all the fields with valid values", "initial deposit must be non-negative",   |
|        |                               | Cria uma nova conta para um cliente                  |  "Invalid account type. Must be 'checking' or 'savings'." || (404), "Customer not found." || (500), "Server error"                |
┣--------╋-------------------------------╋------------------------------------------------------╋-----------------------------------------------------------------------------------------------------------------------------------┫
| GET    | /accounts/:accountId/balance  | Gets the balance of an account /                     | (200), return the balance of the account || (404), "Account not found." || (500), "Server error"                                  |
|        |                               | Consulta o saldo de uma conta específica             |                                                                                                                                   |
┣--------╋-------------------------------╋------------------------------------------------------╋-----------------------------------------------------------------------------------------------------------------------------------┫
| GET    | /accounts/:accountId/         | Gets the informations of one account /               | (200), return the informations of the account / (404), "Account not found." || (500), "Server error"                              |
|        |                               | Consulta as informações de um conta específica       |                                                                                                                                   |
┣--------╋-------------------------------╋------------------------------------------------------╋-----------------------------------------------------------------------------------------------------------------------------------┫
| DELETE | /accounts/:accountId/         | Delete an specific account by its ID /               | (200), "Account deleted successfuly" || (404), "Account not found." || (500), "Server error"                                      |
|        |                               | Deleta uma conta específica pelo seu ID              |                                                                                                                                   |
┕--------┷-------------------------------┷------------------------------------------------------┷-----------------------------------------------------------------------------------------------------------------------------------┙



````

````POST /accounts/new```` Body Example:
````
JSON
{
  "customerId": "cus000001",
  "initialDeposit": 1500,
  "accountType": "checking",
  "branch": "0001"
}
````


💳 Transactions / Transações
````
┌--------┯---------------------------┯-----------------------------------------------------┯-----------------------------------------------------------------------------------------------------------------------------------------------------------┓
| Method | Endpoint                  | Description                                         | Server status                                                                                                                                             |
╞========╪===========================╪=====================================================╪===========================================================================================================================================================╡
| POST   | /transactions/new         | Performs a transaction (credit or debit) /          | (201), "Transaction created successfuly" || (400), "Fill all fields with valid values", "Transaction type must be either credit or debit.",               |
|        |                           |  Realiza uma nova transação (crédito ou débito)     | "Amount must be greater than zero.", "Insufficient funds for this debit transaction." || (404), "Account not found." || (500), "Server error"             |
┣--------╋---------------------------╋-----------------------------------------------------╋-----------------------------------------------------------------------------------------------------------------------------------------------------------┫
| POST   | /transactions/transfer    | Transfers funds between accounts /                  | (201), "Transfer successful" || (400), "Fill all fields with valid values", "Cannot transfer to the same account.", "Amount must be greater than zero.",  |
|        |                           | Transfere fundos entre duas contas                  | "Insufficient funds in source account." || (404), "Source account not found.", "Destination account not found." || (500), "Server error"                  |
┣--------╋---------------------------╋-----------------------------------------------------╋-----------------------------------------------------------------------------------------------------------------------------------------------------------┫
| GET    | /transactions/:accountId  | Lists all transactions (statement) /                | (200), Returns a list of all transactions of an account || (500), "Server error"                                                                          |
|        |                           | Lista todas as transações de uma conta (extrato)    |                                                                                                                                                           |
┕--------┷---------------------------┷-----------------------------------------------------┷-----------------------------------------------------------------------------------------------------------------------------------------------------------┙


````
````POST /transactions/new```` Body Example:
````
JSON
{
  "accountId": "acc000001",
  "transactionType": "credit",
  "amount": 500.00,
  "description": "Depósito via transferência",
  "category": "Renda"
}
````
````POST /transactions/transfer```` Body Example:
````
JSON
{
  "fromAccountId": "acc000001",
  "toAccountId": "acc000002",
  "amount": 150.00,
  "description": "Pagamento de fatura",
  "category": "Transferência"
}
````

## 📈 Next Steps / Próximos Passos
- [ ] JWT Authentication: Implement authentication and authorization
- [ ] CRUD Operations: Add endpoints for updating and deleting data (PUT/DELETE)
- [ ] Error Logging: Implement a robust logging system for error monitoring
- [ ] Testing: Create a comprehensive suite of unit and integration tests
- [ ] API Documentation: Document the API with Swagger/OpenAPI

## 📜 License / Licença
This project is licensed under the ISC License.

## 👨‍💻 Author / Autor
Made by GUIf.

