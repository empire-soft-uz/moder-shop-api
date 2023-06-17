export default interface IProps {
  type: string;
  options: [IOption];
  label: string;
}
interface IOption {
  label: string;
  value: string;
}
