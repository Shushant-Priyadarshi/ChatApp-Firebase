import {Box,Container ,VStack,Button,Input,HStack} from "@chakra-ui/react";
import Message from "./components/Message";
import {GoogleAuthProvider,signInWithPopup,getAuth,onAuthStateChanged ,signOut  } from "firebase/auth"
import {app} from "./firebase"
import { useState } from "react";
import { useEffect } from "react";
import {getFirestore,addDoc,collection, serverTimestamp,onSnapshot,query,orderBy} from "firebase/firestore"
import { useRef } from "react";

const auth =getAuth(app);
const db =getFirestore(app);

const loginHander=()=>{
  const provider = new GoogleAuthProvider();
  signInWithPopup(auth,provider);
}

const logoutHandler = ()=> signOut(auth);


function App() {
 
  const [user,setUser] =useState(false);
  const [message,setMessage] =useState("");
  const [messages,setMessages] =useState([]);

  const divForScroll =useRef(null);
  const submitHandler =async(e)=>{
    e.preventDefault();
  
    try{
      setMessage("");
      await addDoc(collection(db,"Messages"),{
        text:message,
        uid:user.uid,
        uri:user.photoURL,
        createtAt:serverTimestamp()
      })
      divForScroll.current.scrollIntoView({behavior:"smooth"});
    }catch(error){
      alert(error)
    }
  }

  useEffect(()=>{
    const q = query(collection(db,"Messages"),orderBy("createtAt","asc"));

    const unsubscribe =onAuthStateChanged(auth,(data)=>{
      setUser(data);
    });
    
   const unsubscribeForMessage=onSnapshot(q,(snap)=>{
      setMessages(
      snap.docs.map((item)=>{
      const id =item.id;
      return {id, ...item.data()};
      })
    );
   });
    
   return () => {
      unsubscribe();
      unsubscribeForMessage();
    };
},[]);

  
  return (
    <>
      <Box bg={"pink.100"}>
        {
          user?(
            <Container h={"100vh"} bg={"white"}>
          <VStack h="full" paddingY={"4"} >
              <Button w="full" colorScheme={"red"} onClick={logoutHandler}>
                  Logout
              </Button>

              <VStack h="full" w="full"  overflowY="auto" css={{"&::-webkit-scrollbar":{
                display:"none",
              }}}>
                {
                  messages.map(item=>(
                    <Message key={item.id} text={item.text} uri={item.uri} user={item.uid===user.uid?"me":"other"}></Message>
                  ))
                }
                
              <div ref={divForScroll}></div>
              </VStack>
                

              <form style={{width:"100%"}} onSubmit={submitHandler}>
                <HStack>
                  <Input placeholder="Enter Message..." value={message} onChange={(e)=> setMessage(e.target.value)}></Input>
                  <Button colorScheme="green" type="submit" >Send</Button>
                </HStack>
              </form>

          </VStack>
        </Container>
          ):<VStack height="100vh" justifyContent={"center"} >
              <Button onClick={loginHander}>Sign in With Google</Button>
          </VStack>
          
        }
      </Box>
    </>
  )
}
  


export default App
