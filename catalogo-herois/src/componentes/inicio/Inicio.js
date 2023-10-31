import Heroi from '../heroi/Heroi.js'
import Categoria from '../categoria/Categoria.js'

export default function Inicio(props) {
    return (
        <>
            <div className="container">
                <Heroi />
                <hr />
                <Categoria />
            </div>
        </>
    )
}