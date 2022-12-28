import { Control } from '../../../../types';

export function Select({ data, onChange, settings }: Control) {
  function onSelectChange(event: any) {
    onChange(event.target.value);
    event.stopPropagation();
  }

  return (
    <select value={data.value} onChange={onSelectChange}>
      {settings.type === 'select' &&
        settings.options.map((option) => <option value={option}>{option}</option>)}
    </select>
  );
}
