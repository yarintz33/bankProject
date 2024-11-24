import { useEffect, useState } from "react";
import './css/Transactions.css';



const TransactionList = () => {
    
    useEffect(() => {

        async function getTransactions() {
    
            const result = await fetch("http://localhost:5000/api/1/users/transactions", {
              method: "GET",
              credentials : 'include',
            }).then((response) => response.json())
             .then((data) => {
                console.log(data);
                const transactions = data["transactions"];
                transactions.map(transaction => {
                    transaction["date"] = (new Date(Date.parse(transaction.createdAt)).toGMTString());
                    transaction.expanded = false;
                })
                setTransactions(data["transactions"]);
            })
              .catch((error) => {
                window.alert(error);
                return;
              });
          }

        getTransactions();
        
      }, []);

    const [transactions, setTransactions] = useState([]);
    const [expanded, setExpanded] = useState(false); 

    const toggleExpand = (transaction) => {
      setExpanded(! expanded);
      transaction.expanded = !transaction.expanded;
    };
  
    return (
      <div style={{ maxWidth: "600px", margin: "0 auto" }}>
        {(transactions || []).map((transaction) => {
          const isForClient = transaction.to == localStorage.getItem("email");

          return (   
            <div
            className="wrapper"
            style={{
                border: "1px solid #ccc",
                borderRadius: "8px",
                padding: "10px",
                marginBottom: "10px",
                background: "#f9f9f9",
            }}
              key={transaction.id}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span
                  style={{
                    color: isForClient ? "green" : "red",
                    fontWeight: "bold",
                  }}
                >
                  {isForClient ? "+" : "-"}${transaction.amount}
                </span>
                <span>{transaction.date}</span>
                <button
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color : "gray",
                    fontSize: "1.2rem",
                  }}
                  onClick={() => toggleExpand(transaction)}
                >
                  {expanded === transaction.id ? "▲" : "▼"}
                </button>
              </div>
              {transaction.expanded === true && (
                <div
                  style={{
                    marginTop: "10px",
                    padding: "10px",
                    borderRadius: "5px",
                  }}
                >
                  <p><strong>From:</strong> {transaction.from}</p>
                  <p><strong>To:</strong> {transaction.to}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };
  
  export default TransactionList;