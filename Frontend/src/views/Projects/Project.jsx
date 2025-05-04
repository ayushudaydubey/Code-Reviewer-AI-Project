import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {io} from 'socket.io-client'

const Project = () => {
  const params = useParams();
  const [messages, setmessages] = useState(["hello","kese ho"])

  useEffect(() => {
    io("http://localhost:3000")
  }
    
)
  

  return (
    <main className="box-border">
      <section className="flex items-start justify-between gap-4 px-4 py-4">

        <div className="chat h-[95vh] w-full bg-teal-700 relative rounded-md overflow-hidden flex flex-col">


          <div className="messages-area flex-1 flex flex-col   overflow-y-auto px-4 pt-4 pb-20 text-white font-semibold text-md space-y-3 ">
          
          {messages.map((msg)=>{
            return   <div className="message self-start inline-block px-4 py-2 bg-teal-800 rounded-xl">
            <span>{msg}</span>
          </div>
          })}

           
          
            
          </div>


          <div className="input-area  absolute  left-0 right-0 bottom-0 p-4 bg-teal-800 flex items-center gap-4">
            <input
              className="flex-grow px-4 py-2 rounded outline-none bg-white text-black placeholder-gray-500"
              type="text"
              placeholder="Type Message..."
            />
            <button className="text-white text-xl">
              <i className="ri-send-plane-2-line text-teal-800 bg-white p-3 rounded-full"></i>
            </button>
          </div>
        </div>


        <div className="code h-[95vh] w-full bg-zinc-800 rounded-md"></div>


        <div className="review h-[95vh] w-full bg-gray-700 rounded-md"></div>
      </section>
    </main>
  );
};

export default Project;
