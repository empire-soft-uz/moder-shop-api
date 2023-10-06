import { IPropValue } from "./IPropValue"

export default  interface IFormatedProps {
    id:string
    name:string
    label:string
    values:[{
        id:string;
        value:string
    }]
}