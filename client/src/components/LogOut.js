import React, { Component } from 'react';
import {Button} from 'reactstrap'

class LogOutButton extends Component {
    constructor(props) {
        super(props);
        this.state = {  }
    }
    render() { 
        return (  
            <div>
                <Button onClick={()=> (localStorage.removeItem('the_main_app'), window.location.reload(false)) } color="danger">Log Out</Button>{' '}
            </div>
        );
    }
}
 
export default LogOutButton;