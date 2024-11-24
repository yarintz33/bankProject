import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TransactionList from "./transactionList";



function Home() {
    //const navigate = useNavigate();
    const navigate = useNavigate();


    
    return <div> 
    <button onClick={handleSubmit}> logout</button>;
        <TransactionList/> 
    </div>; 
    

    async function handleSubmit(e) {
        e.preventDefault();
    
        await fetch("http://localhost:5000/api/1/logout", {
          method: "GET",
          credentials : 'include',
        })
          .catch((error) => {
            window.alert(error);
            return;
          });
          navigate('/login');
      }

   

}

export default Home;