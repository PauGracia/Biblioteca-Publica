import Header from "../components/Header"
import Paragraph from "../components/Paragraph"


function Prestacs({ username}) {
    return (
        <div className="container">
            <Header level={2}>Hola, {username} (Bibliotecario)</Header>
            
        </div>
    );
}

export default Prestacs