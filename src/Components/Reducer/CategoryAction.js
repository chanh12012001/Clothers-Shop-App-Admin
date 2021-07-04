import {firestore} from "../../firebase";

export const LoadCategories = () => {
    return(dispatch,getState) => { 
        
        firestore
        .collection("CATEGORIES").orderBy('index')
        .get()
        .then(querySnapshot=>{
                let categories = []
            if(!querySnapshot.empty){
                querysnapshot.forEach(doc => {
                    categoriees.push(doc.data());
                  });
                dispatch({type:"LOAD_CATEGORIES",  payload:categories })
            }
        }).catch(error=>{
            console.log(error)
        });
    };
};