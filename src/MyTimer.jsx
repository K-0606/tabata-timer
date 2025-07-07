import { use, useEffect, useRef, useState } from "react";

const MyTimer = () => {
    const [myTimer, setMyTimer] = useState(new Date().toLocaleString());
    const [printLastTime, setPrintLastTime] = useState();
    const [isPrint, setIsPrint] = useState(false);
    const [myRecord, setMyRecord] = useState([]);
    const [isRecord, setIsRecord] = useState(false);


    const myLastRef = useRef();
    

    useEffect(()=>{
        const time = setInterval(()=>{
            setMyTimer(new Date().toLocaleString())
        },1000);
        return ()=> clearInterval(time);
    },[]);

    useEffect(() => {
        if(isPrint){
            myLastRef.current = new Date().toLocaleString();
            setPrintLastTime(myLastRef.current);
            setIsPrint(false);
        }
        
    }, [isPrint]);


    useEffect(()=>{
        if(isRecord){
            setMyRecord(prev => [...prev, new Date().toLocaleString()]);
            setIsRecord(false);
        }
    }, [isRecord]);


    const getDate = ()=>{
        setIsPrint(true);
    }

    const recordData = () => {
        setIsRecord(true)
    }

    return(
    <>
        <h2>現在的時間：{myTimer}</h2>
        <button onClick={getDate}>我是按鈕</button>
        <h2>上次的紀錄的時間：{printLastTime}</h2>

        <h2>紀錄全部點擊時間：</h2>
        <ul>
            {myRecord.map((time, index)=>{
                <li key={index}>{time}</li>
            })}
            
        </ul>
        <button onClick={recordData}>紀錄全部</button>
    </>
    );
};
export default MyTimer;