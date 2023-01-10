import { effect } from '@preact/signals';

import type { ControlRenderFn } from 'app/types';

function wrapSetupEffects(userSetup?: ControlRenderFn): ControlRenderFn | undefined {
  if (!userSetup) return undefined;

  return function wrappedUserSetupWithEffect(data, c) {
    effect(() => userSetup(data, c));
  };
}

export default { wrapSetupEffects };
