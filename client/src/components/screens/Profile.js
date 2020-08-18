import React,{useEffect,useState,useContext} from "react"
import {UserContext} from '../../App'

const Profile = ()=>{
    const {state,dispatch} = useContext(UserContext);
    const [mypic,setMyPic] = useState([]);
    const [image,setImage] = useState("");
    const [url,setUrl] = useState(undefined)
    useEffect(()=>{
        
        fetch('/mypost',{
            headers:{
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            }
        }).then(res=>res.json())
        .then(result=>{
         //   console.log(state);
            setMyPic(result.mypost);
        })
    },[])

    useEffect(()=>{
        if(image){
         const data = new FormData()
         data.append("file",image);
        data.append("upload_preset","insta-clone");
        data.append("clond_name","vineet7388");
        fetch("https://api.cloudinary.com/v1_1/vineet7388/image/upload",{
             method:"post",
             body:data
         })
         .then(res=>res.json())
         .then(data=>{
     
        
            fetch('/updatepic',{
                method:"put",
                headers:{
                    "Content-Type":"application/json",
                    "Authorization":"Bearer "+localStorage.getItem("jwt")
                },
                body:JSON.stringify({
                    pic:data.url
                })
            }).then(res=>res.json())
            .then(result=>{
             //   console.log(result)
                localStorage.setItem("user",JSON.stringify({...state,pic:result.pic}))
                dispatch({type:"UPDATEPIC",payload:result.pic})
                //window.location.reload()
            })
        
         })
         .catch(err=>{
             console.log(err)
         })
        }
     },[image])
     const updatePhoto = (file)=>{
         setImage(file)
     }
    return (
        <div style={{maxWidth:"600px",margin:"0px auto"}}>
            <div  style={{
              margin:"18px 0px",
               borderBottom:"1px solid grey"
           }}>
                 <div style={{
               display:"flex",
               justifyContent:"space-around",
              
           }}>
               <div>
                   <img style={{width:"160px",height:"160px",borderRadius:"80px"}}
                   src={state?state.pic:"loading"}
                   />
                 
               </div>
                <div>
                    <h4>{state ? state.name : ""}</h4>
                    <h5>{state?state.email:"loading"}</h5>
                    <div style={{display:"flex",
                    justifyContent:"space-between",
                    width:"150%"
                }}>
                         <h6>{mypic.length} posts</h6>
                    </div>
                </div>
                
            </div>
           
            <div className="file-field input-field" style={{margin:"10px"}}>
            <div className="btn #64b5f6 blue darken-1">
                <span>Update pic</span>
                <input type="file" onChange={(e)=>updatePhoto(e.target.files[0])} />
            </div>
            <div className="file-path-wrapper">
                <input className="file-path validate" type="text" />
            </div>
            </div>
            </div>

            <div className="gallery">
            
                {
                    mypic.map(item=>{
                        return (
                            <div className="card home-card">
                            <div className="card-image">
                                <img src={item.photo}/>
                            </div>
                            <div className="card-content">
                                <i className="material-icons" style={{color:"red"}}>favorite</i>
                                <h6>{item.likes.length}</h6>
                                <h6>{item.title}</h6>
                                <p>{item.body}</p>
                                <input type="text" placeholder="add a comment"/>
                            </div>
                            </div>
                        )
                    })
                } 
            </div>
        </div>
    )
}

export default Profile