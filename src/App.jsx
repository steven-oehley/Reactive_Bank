import { useState } from "react";
import { initialUsers } from "./data/data";

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const isLoggedIn = !!currentUser;

  function handleSetUser(username, password) {
    const userLogin = initialUsers.filter(
      (user) => user.username === username && user.password === password
    );
    if (userLogin.length === 0) return;

    setCurrentUser(userLogin[0]);
    return true;
  }

  function handleLogOut() {
    setCurrentUser(null);
  }

  return (
    <>
      <Nav currentUser={currentUser} logOut={handleLogOut} />
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        {!isLoggedIn && <Login handleSetUser={handleSetUser} />}
        {isLoggedIn && (
          <BankingDashBoard
            currentUser={currentUser}
            setCurrentUser={setCurrentUser}
          />
        )}
      </div>
    </>
  );
}

export default App;

// ***********
// NAV
// ***********
function Nav({ currentUser, logOut }) {
  return (
    <nav className="bg-gray-700 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-white text-lg">
          {currentUser ? `Welcome, ${currentUser.name}` : "Welcome, Guest"}
        </div>
        {currentUser && (
          <button
            onClick={logOut}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}

// ***********
// LOGIN
// ***********
function Login({ handleSetUser }) {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [loginFailed, setLoginFailed] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    const loginSuccess = handleSetUser(userName, password);
    if (loginSuccess) {
      setLoginFailed(!loginSuccess);
    } else {
      setUserName("");
      setPassword("");
      setLoginFailed(!loginSuccess);
    }
  }

  return (
    <div className="bg-gray-800 p-8 rounded shadow-md w-full max-w-xs">
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-bold mb-2 text-white">
            Enter Username:
          </label>
          <input
            className="w-full px-3 py-2 text-gray-900 rounded"
            type="text"
            placeholder="Username"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-bold mb-2 text-white">
            Enter Password:
          </label>
          <input
            className="w-full px-3 py-2 text-gray-900 rounded"
            type="password"
            placeholder="******"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Submit
        </button>
      </form>
      <p className={`mt-4 ${loginFailed ? "text-red-500" : "text-slate-300"}`}>
        {!loginFailed
          ? "Enter your login information"
          : "Incorrect login provided, please try again"}
      </p>
    </div>
  );
}

function BankingDashBoard({ currentUser, setCurrentUser }) {
  return (
    <div className="bg-gray-600 p-8 rounded shadow-md w-full max-w-4xl flex max-h-full">
      <div className="flex-1 ml-8 overflow-y-auto ">
        <Transactions currentUser={currentUser} />
      </div>
      <div className="ml-8">
        <TransactionRequest
          currentUser={currentUser}
          setCurrentUser={setCurrentUser}
        />
      </div>
    </div>
  );
}

function Transactions({ currentUser }) {
  return (
    <div>
      <ul className="max-h-full overflow-y-auto">
        {currentUser.transactions.map((transaction) => (
          <li
            key={transaction.id}
            className="mb-4 p-4 bg-white rounded shadow-md"
          >
            <p>ID: {transaction.id}</p>
            <p
              className={
                transaction.amount < 0 ? "text-red-500" : "text-green-500"
              }
            >
              Amount: {transaction.amount}
            </p>
            <p>Description: {transaction.description}</p>
          </li>
        ))}
      </ul>
      <p className="text-white">
        Account Balance:{" "}
        <span
          className={
            currentUser.transactions.reduce(
              (total, transaction) => total + transaction.amount,
              0
            ) >= 0
              ? "text-green-500"
              : "text-red-500"
          }
        >
          R
          {currentUser.transactions.reduce(
            (total, transaction) => total + transaction.amount,
            0
          )}
        </span>
      </p>
    </div>
  );
}

function TransactionRequest({ currentUser, setCurrentUser }) {
  const [transactionType, setTransactionType] = useState("deposit");

  const handleChange = (e) => {
    setTransactionType(e.target.value);
  };

  function handleSubmit(e, tType, tAmount, tDescription) {
    e.preventDefault();
    let amount = 0;

    if (tType === "deposit" || tType === "loan") {
      amount = tAmount;
    } else {
      amount = -tAmount;
    }

    setCurrentUser((prevUser) => {
      const lastId =
        prevUser.transactions.length > 0
          ? prevUser.transactions[prevUser.transactions.length - 1].id
          : 0;

      const newTransaction = {
        id: lastId + 1,
        amount: amount,
        description: tDescription,
      };

      return {
        ...prevUser,
        transactions: [...prevUser.transactions, newTransaction],
      };
    });
  }

  return (
    <div className="p-4 bg-white rounded shadow-md">
      <TransactionSelect
        transactionType={transactionType}
        onChange={handleChange}
      />
      <TransactionForm
        transactionType={transactionType}
        handleSubmit={handleSubmit}
      />
    </div>
  );
}

function TransactionSelect({ transactionType, onChange }) {
  return (
    <>
      <h2 className="text-lg font-semibold mb-4">Transaction Form</h2>
      <div className="flex items-center mb-4">
        <input
          type="radio"
          id="deposit"
          name="transactionType"
          value="deposit"
          checked={transactionType === "deposit"}
          onChange={onChange}
        />
        <label htmlFor="deposit" className="ml-2 mr-4">
          Deposit
        </label>

        <input
          type="radio"
          id="withdrawal"
          name="transactionType"
          value="withdrawal"
          checked={transactionType === "withdrawal"}
          onChange={onChange}
        />
        <label htmlFor="withdrawal" className="ml-2 mr-4">
          Withdrawal
        </label>

        <input
          type="radio"
          id="loan"
          name="transactionType"
          value="loan"
          checked={transactionType === "loan"}
          onChange={onChange}
        />
        <label htmlFor="loan" className="ml-2">
          Loan Request
        </label>
      </div>
    </>
  );
}

function TransactionForm({ transactionType, handleSubmit }) {
  const [transactionAmount, setTransactionAmount] = useState(0);
  const [transactionDescription, setTransactionDescription] = useState("");

  const resetForm = () => {
    setTransactionAmount(0);
    setTransactionDescription("");
  };

  const onSubmit = (e) => {
    e.preventDefault();
    handleSubmit(e, transactionType, transactionAmount, transactionDescription);
    // Reset form after submission
    resetForm();
  };

  return (
    <form onSubmit={onSubmit}>
      <div className="mb-4">
        <label htmlFor="amount" className="block font-semibold text-gray-800">
          {transactionType.slice(0, 1).toUpperCase() + transactionType.slice(1)}{" "}
          Amount:
        </label>
        <input
          type="number"
          id="amount"
          value={transactionAmount}
          onChange={(e) => setTransactionAmount(Number(e.target.value))}
          className="w-full px-3 py-2 mt-1 text-gray-700 border rounded-md focus:outline-none focus:border-blue-500"
        />
      </div>
      <div className="mb-4">
        <label
          htmlFor="description"
          className="block font-semibold text-gray-800"
        >
          {transactionType.slice(0, 1).toUpperCase() + transactionType.slice(1)}{" "}
          Description:
        </label>
        <input
          type="text"
          id="description"
          value={transactionDescription}
          onChange={(e) => setTransactionDescription(e.target.value)}
          className="w-full px-3 py-2 mt-1 text-gray-700 border rounded-md focus:outline-none focus:border-blue-500"
        />
      </div>
      <button
        type="submit"
        className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Submit{" "}
        {transactionType.slice(0, 1).toUpperCase() + transactionType.slice(1)}
      </button>
    </form>
  );
}
