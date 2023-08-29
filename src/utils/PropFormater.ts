import IFormatedProps from "../Interfaces/Product/IFormaterProps";
import { IPropValue } from "../Interfaces/Product/IPropValue";

export default class PropFormater {
  public static format(props: IPropValue[]): IFormatedProps[] {
    let formatedProps: IFormatedProps[] = [];
    props.map((p, i) => {
      let curFormProp = formatedProps.find((P) => p.prop.id === P.id);
      if (curFormProp) {
        curFormProp.values.push({ id: p.id, value: p.value });
      } else {
        formatedProps.push({
          id: p.prop.id,
          name: p.prop.name,
          label: p.prop.label,
          values: [{ id: p.id, value: p.value }],
        });
      }
    });

    return formatedProps;
  }
}
