import { Control, ControlCategory } from '../../types';

type GroupedControls = Record<ControlCategory, Control[]>;
type ControlGroup = [ControlCategory, Control[]];

const categoryPriority: Record<ControlCategory, number> = {
  rendering: 0,
  stats: 1,
  custom: 2,
};

function groupControlsByCategory(controls: Control[]): ControlGroup[] {
  const grouped = controls.reduce((groupedControls, control) => {
    const { category = 'custom' } = control.settings;
    if (category in groupedControls) {
      groupedControls[category].push(control);
    } else {
      groupedControls[category] = [control];
    }
    return groupedControls;
  }, {} as GroupedControls);

  const entries = Object.entries(grouped) as ControlGroup[];

  return entries.sort(function sortByCategoryPriority(
    firstEntry: ControlGroup,
    secondEntry: ControlGroup,
  ) {
    const [firstCategory = 'custom'] = firstEntry;
    const [secondCategory = 'custom'] = secondEntry;

    return categoryPriority[firstCategory] - categoryPriority[secondCategory];
  });
}

export default { groupControlsByCategory };
