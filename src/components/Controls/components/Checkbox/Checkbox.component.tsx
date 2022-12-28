import { Control } from '../../../../types';

export function Checkbox({ id, data, onChange }: Control) {
  function onCheckboxChange(event: any) {
    onChange(event.target.checked);
    event.stopPropagation();
  }

  return (
    <label for={id}>
      {id}
      <input id={id} type="checkbox" checked={data.value} onChange={onCheckboxChange} />
    </label>
  );
}
