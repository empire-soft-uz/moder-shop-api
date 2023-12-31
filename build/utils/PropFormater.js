"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class PropFormater {
    static format(props) {
        let formatedProps = [];
        props.map((p, i) => {
            let curFormProp = formatedProps.find((P) => p.prop.id === P.id);
            if (curFormProp) {
                curFormProp.values.push({ id: p.id, value: p.value });
            }
            else {
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
exports.default = PropFormater;
