import React, {useContext, useEffect} from "react";
import { Context as UserContext } from '../../store/contexts/user/Store'
import { authMiddleWare } from '../../util/auth'

const Home = ( {history} ) => {
    const [userState] = useContext(UserContext);
    let {authUser} = userState;

    useEffect(()=>{
        authMiddleWare(history);
    },[history]);
    
    return (
        <React.Fragment>
            {authUser === null ? '' :
                <div>
                    Home page
                </div>
            }
        </React.Fragment>
    )
}

export default Home;