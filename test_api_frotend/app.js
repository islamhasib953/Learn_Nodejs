fetch('http://localhost:5000/api/courses')
    .then((res)=>res.json())
    .then((data)=>{
      console.log(data)
    });